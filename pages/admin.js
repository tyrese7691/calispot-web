import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Cap how many months of retention we show in the chart.
const MAX_RETENTION_MONTHS = 12;

// How many months of month-to-month history to show in the trend charts.
const TREND_MONTHS = 12;

// Distinct line colors keyed by calendar month so the same cohort month
// always shows the same color (Mar is always gold, Jul is always violet, etc).
const COHORT_MONTH_COLORS = [
  "#3B82F6", // Jan — blue
  "#EF4444", // Feb — red
  "#F59E0B", // Mar — gold
  "#10B981", // Apr — green
  "#F97316", // May — orange
  "#14B8A6", // Jun — teal
  "#8B5CF6", // Jul — violet
  "#EC4899", // Aug — pink
  "#FBBF24", // Sep — amber
  "#34D399", // Oct — emerald
  "#FB923C", // Nov — red-orange
  "#06B6D4", // Dec — cyan
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Build an array of the last N month keys (oldest → newest), e.g. "2026-03".
function lastNMonthKeys(n) {
  const keys = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    keys.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }
  return keys;
}

// "2026-03" → "Mar '26"
function prettyMonth(key) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} '${y.slice(-2)}`;
}

export default function AdminDashboard() {
  const [authState, setAuthState] = useState("loading"); // loading | signedOut | notAdmin | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setAuthState("signedOut");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();
    if (profile?.is_admin) {
      setAuthState("admin");
      loadMetrics();
    } else {
      setAuthState("notAdmin");
    }
  }

  async function signIn(e) {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      checkAuth();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAuthState("signedOut");
    setMetrics(null);
  }

  async function loadMetrics() {
    const now = new Date();
    const day = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Window covering the trend charts (TREND_MONTHS back), for the monthly queries.
    const trendStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (TREND_MONTHS - 1), 1)).toISOString();

    // ----- Headline totals -----
    const [{ count: totalUsers }, { count: totalSessions }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("sessions").select("id", { count: "exact", head: true }),
    ]);

    // ----- Current MAU (last 30d, any session incl. home sessions — no spot filter) -----
    const { data: mauData } = await supabase
      .from("sessions").select("user_id").gte("trained_at", month);
    const mau = new Set((mauData || []).map(r => r.user_id)).size;

    // ----- All signups in the trend window, for monthly signups -----
    const { data: signupRows } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", trendStart)
      .order("created_at", { ascending: true });

    // ----- All sessions in the trend window (NO spot filter — home sessions included) -----
    const { data: sessionRows } = await supabase
      .from("sessions")
      .select("user_id, trained_at, spot_id")
      .gte("trained_at", trendStart);

    // ----- Build month-to-month series -----
    const monthKeys = lastNMonthKeys(TREND_MONTHS);

    // signups per month
    const signupsByMonth = Object.fromEntries(monthKeys.map(k => [k, 0]));
    (signupRows || []).forEach(p => {
      const k = (p.created_at || "").slice(0, 7);
      if (signupsByMonth[k] !== undefined) signupsByMonth[k] += 1;
    });

    // sessions per month + active users per month (distinct user_id per month)
    const sessionsByMonth = Object.fromEntries(monthKeys.map(k => [k, 0]));
    const homeSessionsByMonth = Object.fromEntries(monthKeys.map(k => [k, 0]));
    const activeUsersByMonth = Object.fromEntries(monthKeys.map(k => [k, new Set()]));
    (sessionRows || []).forEach(s => {
      const k = (s.trained_at || "").slice(0, 7);
      if (sessionsByMonth[k] === undefined) return;
      sessionsByMonth[k] += 1;
      if (!s.spot_id) homeSessionsByMonth[k] += 1; // spot-less = home session
      activeUsersByMonth[k].add(s.user_id);
    });

    const monthly = monthKeys.map(k => ({
      month: prettyMonth(k),
      signups: signupsByMonth[k],
      sessions: sessionsByMonth[k],
      homeSessions: homeSessionsByMonth[k],
      spotSessions: sessionsByMonth[k] - homeSessionsByMonth[k],
      activeUsers: activeUsersByMonth[k].size,
    }));

    // ----- Daily signups (last 30 days) — kept as a recent-detail view -----
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", month)
      .order("created_at", { ascending: true });

    const growthByDay = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      growthByDay[key] = 0;
    }
    (profilesData || []).forEach(p => {
      const key = p.created_at.slice(0, 10);
      if (growthByDay[key] !== undefined) growthByDay[key] += 1;
    });
    const growth = Object.entries(growthByDay).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));

    // ----- Cohort retention (unchanged) -----
    const { data: cohortData, error: cohortError } = await supabase
      .from("_insights_cohort_retention_active")
      .select("*")
      .order("cohort_month", { ascending: false })
      .order("months_since_signup", { ascending: true });

    if (cohortError) {
      console.error("Cohort retention query failed:", cohortError);
    }
    const cohortRetention = buildActivatedCohortRetention(cohortData || []);

    // ----- Top 10 spots last 30 days (unchanged — home sessions correctly excluded, no spot to rank) -----
    const { data: spotsData } = await supabase
      .from("sessions")
      .select("spot_id, spot_name, user_id")
      .gte("trained_at", month);

    const spotCounts = {};
    (spotsData || []).forEach(s => {
      if (!s.spot_id) return;
      const key = s.spot_id;
      if (!spotCounts[key]) {
        spotCounts[key] = { name: s.spot_name || s.spot_id, sessions: 0, users: new Set() };
      }
      spotCounts[key].sessions += 1;
      spotCounts[key].users.add(s.user_id);
    });
    const topSpots = Object.entries(spotCounts)
      .map(([slug, v]) => ({ slug, name: v.name, sessions: v.sessions, users: v.users.size }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    setMetrics({
      totalUsers: totalUsers ?? 0,
      totalSessions: totalSessions ?? 0,
      mau,
      monthly,
      growth,
      cohortRetention,
      topSpots,
    });
  }

  if (authState === "loading") return <Loading />;

  if (authState === "signedOut") {
    return (
      <Layout>
        <h1>Admin sign in</h1>
        <form onSubmit={signIn} style={styles.form}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={styles.input} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={styles.input} required />
          <button type="submit" style={styles.button}>Sign in</button>
          {authError && <p style={{ color: "red" }}>{authError}</p>}
        </form>
      </Layout>
    );
  }

  if (authState === "notAdmin") {
    return (
      <Layout>
        <h1>Access denied</h1>
        <p>Your account does not have admin access.</p>
        <button onClick={signOut} style={styles.button}>Sign out</button>
      </Layout>
    );
  }

  if (!metrics) return <Loading />;

  return (
    <Layout>
      <Head><title>CaliSpot Admin</title></Head>
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ marginBottom: 4 }}>CaliSpot</h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>Growth & engagement — month by month</p>
        </div>
        <button onClick={signOut} style={styles.signOutButton}>Sign out</button>
      </div>

      {/* Headline numbers */}
      <Section title="Where we are today" subtitle="The totals at a glance.">
        <div style={styles.metricRow}>
          <BigMetric label="Total users" value={metrics.totalUsers.toLocaleString()} subtitle="All-time signups" />
          <BigMetric label="Total sessions" value={metrics.totalSessions.toLocaleString()} subtitle="All workouts logged (incl. home sessions)" />
          <BigMetric label="Active users" value={metrics.mau.toLocaleString()} subtitle="Trained in the last 30 days" />
        </div>
      </Section>

      {/* Monthly signups */}
      <Section title="New users each month" subtitle="How many people signed up, month by month. The core growth line.">
        <MonthlyBarChart data={metrics.monthly} dataKey="signups" color="#1F2E5C" />
      </Section>

      {/* Monthly sessions, split home vs spot */}
      <Section
        title="Sessions logged each month"
        subtitle="Total workouts logged per month — including home sessions (no spot) as well as sessions at a spot. This is overall engagement."
      >
        <MonthlySessionsChart data={metrics.monthly} />
      </Section>

      {/* Monthly active users */}
      <Section title="Active users each month" subtitle="Distinct people who logged at least one session that month.">
        <MonthlyBarChart data={metrics.monthly} dataKey="activeUsers" color="#10B981" />
      </Section>

      {/* Cohort retention (kept) */}
      <Section
        title="Do people stick around?"
        subtitle="Each line is a group who joined in the same month and logged ≥1 session. It starts at 100% and shows what % were still active each following month. Higher, flatter lines = better retention."
      >
        <CohortRetentionChart
          cohorts={metrics.cohortRetention.cohorts}
          chartData={metrics.cohortRetention.chartData}
          maxMonths={metrics.cohortRetention.maxMonths}
        />
      </Section>

      {/* Daily signups (kept, as recent detail) */}
      <Section title="New users — daily (last 30 days)" subtitle="The recent day-by-day detail behind the monthly signups above.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={metrics.growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1F2E5C" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Top spots (kept) */}
      <Section title="Most-used spots (last 30 days)" subtitle="Where people are actually training. Home sessions aren't listed here — they have no spot.">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Spot</th>
              <th style={styles.th}>Sessions</th>
              <th style={styles.th}>Unique users</th>
            </tr>
          </thead>
          <tbody>
            {metrics.topSpots.map(s => (
              <tr key={s.slug}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.sessions}</td>
                <td style={styles.td}>{s.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Layout>
  );
}

// ============================================================================
// Monthly trend charts
// ============================================================================

function MonthlyBarChart({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Stacked: spot sessions + home sessions = total, so the home contribution is visible.
function MonthlySessionsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="spotSessions" name="At a spot" stackId="s" fill="#1F2E5C" radius={[0, 0, 0, 0]} />
        <Bar dataKey="homeSessions" name="Home sessions" stackId="s" fill="#F59E0B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================================
// Cohort retention — activated-users-only math (unchanged)
// ============================================================================

function buildActivatedCohortRetention(rows) {
  if (rows.length === 0) {
    return { cohorts: [], chartData: [], maxMonths: 0 };
  }

  const byCohort = new Map();
  let maxMonths = 0;

  for (const r of rows) {
    const cohortKey = String(r.cohort_month);
    if (!byCohort.has(cohortKey)) {
      byCohort.set(cohortKey, {
        key: cohortKey,
        cohort_size: r.cohort_size ?? 0,
        rawByMonth: {},
        m0Active: null,
      });
    }
    const m = r.months_since_signup;
    if (m == null || m > MAX_RETENTION_MONTHS) continue;
    if (m > maxMonths) maxMonths = m;

    const active = r.active_users ?? 0;
    byCohort.get(cohortKey).rawByMonth[m] = active;
    if (m === 0) byCohort.get(cohortKey).m0Active = active;
  }

  const cohorts = Array.from(byCohort.values())
    .filter(c => c.m0Active != null && c.m0Active > 0)
    .map(c => {
      const date = new Date(c.key);
      const monthIndex = date.getUTCMonth();
      const year = date.getUTCFullYear();
      const label = `${MONTH_NAMES[monthIndex]} '${String(year).slice(-2)}`;
      return {
        key: c.key,
        label,
        monthIndex,
        m0Active: c.m0Active,
        rawByMonth: c.rawByMonth,
      };
    })
    .sort((a, b) => b.key.localeCompare(a.key));

  const chartData = [];
  for (let m = 0; m <= maxMonths; m++) {
    const row = { x: `+${m}` };
    for (const c of cohorts) {
      const active = c.rawByMonth[m];
      if (active == null) {
        row[c.key] = null;
      } else {
        row[c.key] = +((active / c.m0Active) * 100).toFixed(1);
      }
    }
    chartData.push(row);
  }

  return { cohorts, chartData, maxMonths };
}

function CohortRetentionChart({ cohorts, chartData, maxMonths }) {
  if (cohorts.length === 0) {
    return (
      <div style={styles.cohortChartContainer}>
        <p style={{ color: "#9CA3AF", textAlign: "center", margin: 0 }}>
          No cohort data yet — needs at least one cohort with users active in M0.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.cohortChartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 16, right: 32, left: 8, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="x"
            stroke="#9CA3AF"
            tick={{ fill: "#E5E7EB", fontSize: 13 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="#9CA3AF"
            tick={{ fill: "#E5E7EB", fontSize: 13 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <Tooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 6, color: "#F9FAFB" }}
            labelStyle={{ color: "#9CA3AF" }}
            formatter={(v, name) => {
              if (v == null) return ["—", labelForCohort(cohorts, name)];
              return [`${v}%`, labelForCohort(cohorts, name)];
            }}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            wrapperStyle={{ paddingLeft: 24, color: "#E5E7EB", fontSize: 13 }}
            formatter={(value) => labelForCohort(cohorts, value)}
          />
          {cohorts.map((c) => (
            <Line
              key={c.key}
              type="monotone"
              dataKey={c.key}
              stroke={COHORT_MONTH_COLORS[c.monthIndex]}
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3, fill: COHORT_MONTH_COLORS[c.monthIndex] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function labelForCohort(cohorts, key) {
  const c = cohorts.find((x) => x.key === key);
  return c ? c.label : key;
}

// ============================================================================
// Layout primitives
// ============================================================================

function Layout({ children }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {children}
    </div>
  );
}

function Loading() {
  return <Layout><p>Loading...</p></Layout>;
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 18, marginBottom: subtitle ? 4 : 16, color: "#374151" }}>{title}</h2>
      {subtitle && (
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 0, marginBottom: 16, maxWidth: 720 }}>{subtitle}</p>
      )}
      {children}
    </section>
  );
}

function BigMetric({ label, value, subtitle }) {
  return (
    <div style={styles.metricCard}>
      <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 700, color: "#1F2E5C", lineHeight: 1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{subtitle}</div>}
    </div>
  );
}

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  signOutButton: { padding: "8px 16px", border: "1px solid #d1d5db", background: "white", borderRadius: 6, cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 },
  input: { padding: 12, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 16 },
  button: { padding: "12px 16px", background: "#1F2E5C", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 },
  metricRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  metricCard: { padding: 24, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 12, borderBottom: "2px solid #E5E7EB", fontWeight: 600, fontSize: 14, color: "#374151" },
  td: { padding: 12, borderBottom: "1px solid #E5E7EB", fontSize: 14 },
  cohortChartContainer: { background: "#000", borderRadius: 8, padding: 24, border: "1px solid #1F2937" },
};