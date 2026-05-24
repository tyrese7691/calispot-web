import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Cap how many months of retention we show in the chart.
const MAX_RETENTION_MONTHS = 12;

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
    const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // DAU / WAU / MAU based on sessions — uses trained_at (actual training time)
    const [dauRes, wauRes, mauRes] = await Promise.all([
      supabase.from("sessions").select("user_id").gte("trained_at", day),
      supabase.from("sessions").select("user_id").gte("trained_at", week),
      supabase.from("sessions").select("user_id").gte("trained_at", month),
    ]);

    const dau = new Set((dauRes.data || []).map(r => r.user_id)).size;
    const wau = new Set((wauRes.data || []).map(r => r.user_id)).size;
    const mau = new Set((mauRes.data || []).map(r => r.user_id)).size;

    // Sessions count last 7d / 30d
    const sessions7d = (wauRes.data || []).length;
    const sessions30d = (mauRes.data || []).length;

    // New users per day for last 30 days
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
      date: date.slice(5), // "MM-DD"
      count,
    }));

    // Cohort retention — queries _insights_cohort_retention_active.
    // Columns: cohort_month (date), cohort_size (int), months_since_signup (int),
    //          active_users (int), retention_pct (text/numeric).
    //
    // The chart shows "activated cohort retention" — every cohort line starts
    // at 100% (the users who activated in M0), and subsequent months are
    // normalised against THAT count. This isolates the retention question
    // ("do activated users stick?") from the activation question ("do signups
    // ever take their first action?"). The activation gap is visible elsewhere
    // (cohort sizes, M0 active_users counts).
    const { data: cohortData, error: cohortError } = await supabase
      .from("_insights_cohort_retention_active")
      .select("*")
      .order("cohort_month", { ascending: false })
      .order("months_since_signup", { ascending: true });

    if (cohortError) {
      console.error("Cohort retention query failed:", cohortError);
    }
    const cohortRetention = buildActivatedCohortRetention(cohortData || []);

    // Top 10 spots last 30 days — uses spot_id, spot_name, trained_at
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

    setMetrics({ dau, wau, mau, sessions7d, sessions30d, growth, cohortRetention, topSpots });
  }

  if (authState === "loading") {
    return <Loading />;
  }

  if (authState === "signedOut") {
    return (
      <Layout>
        <h1>Admin sign in</h1>
        <form onSubmit={signIn} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            required
          />
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
        <h1>CaliSpot Admin</h1>
        <button onClick={signOut} style={styles.signOutButton}>Sign out</button>
      </div>

      <Section title="Active users">
        <div style={styles.metricRow}>
          <BigMetric label="DAU" value={metrics.dau} subtitle="Last 24 hours" />
          <BigMetric label="WAU" value={metrics.wau} subtitle="Last 7 days" />
          <BigMetric label="MAU" value={metrics.mau} subtitle="Last 30 days" />
        </div>
      </Section>

      <Section title="New users (last 30 days)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1F2E5C" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section
        title="Cohort retention"
        subtitle="Each cohort starts at 100% (users who logged ≥1 session in their first month). Subsequent points show what % of those activated users were still active in each following month."
      >
        <CohortRetentionChart
          cohorts={metrics.cohortRetention.cohorts}
          chartData={metrics.cohortRetention.chartData}
          maxMonths={metrics.cohortRetention.maxMonths}
        />
      </Section>

      <Section title="Sessions">
        <div style={styles.metricRow}>
          <BigMetric label="Sessions (7d)" value={metrics.sessions7d} />
          <BigMetric label="Sessions (30d)" value={metrics.sessions30d} />
        </div>
      </Section>

      <Section title="Top 10 spots (last 30 days)">
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
// Cohort retention — activated-users-only math
// ============================================================================

// Transforms the raw view rows into chart-ready data where every cohort line
// starts at 100%, and each subsequent month is normalised against that
// cohort's M0 active_users count.
//
// Returns:
//   - cohorts: [{ label, key, monthIndex, m0ActiveUsers }, ...] for legend + colors
//   - chartData: [{ x: "+0", "2026-03-01": 100, "2026-04-01": 100, ... }, ...]
//   - maxMonths: highest months_since_signup present across cohorts
function buildActivatedCohortRetention(rows) {
  if (rows.length === 0) {
    return { cohorts: [], chartData: [], maxMonths: 0 };
  }

  // Group raw rows by cohort_month, capturing M0 active_users for normalisation.
  const byCohort = new Map();
  let maxMonths = 0;

  for (const r of rows) {
    const cohortKey = String(r.cohort_month); // "2026-03-01" or similar
    if (!byCohort.has(cohortKey)) {
      byCohort.set(cohortKey, {
        key: cohortKey,
        cohort_size: r.cohort_size ?? 0,
        rawByMonth: {}, // months_since_signup → active_users
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

  // Drop cohorts that have no M0 data — we can't normalise them.
  // Also drop cohorts where M0 active_users = 0 (no one activated, line would be all 0s/NaN).
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
    // Newest first for legend ordering
    .sort((a, b) => b.key.localeCompare(a.key));

  // Build wide-format chart data: one row per month offset, each cohort is a column.
  const chartData = [];
  for (let m = 0; m <= maxMonths; m++) {
    const row = { x: `+${m}` };
    for (const c of cohorts) {
      const active = c.rawByMonth[m];
      if (active == null) {
        row[c.key] = null;
      } else {
        // Normalise: M0 = 100%, each subsequent month is active/m0Active * 100
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
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: 6,
              color: "#F9FAFB",
            }}
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
  cohortChartContainer: {
    background: "#000",
    borderRadius: 8,
    padding: 24,
    border: "1px solid #1F2937",
  },
};