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

// "2026-03" → "Mar '26"
function prettyMonth(key) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} '${y.slice(-2)}`;
}

// ── Granularity bucketing ───────────────────────────────────────────────────
// How many buckets to show per granularity, and the label for each.
const GRANULARITY_CONFIG = {
  day:   { buckets: 30, label: "Day" },   // last 30 daily buckets
  week:  { buckets: 12, label: "7-day" }, // last 12 weekly buckets
  month: { buckets: TREND_MONTHS, label: "Month" },
};

// Return the bucket key for a given date + granularity.
// day  → "YYYY-MM-DD"
// week → ISO-ish week start (Monday) "YYYY-MM-DD"
// month→ "YYYY-MM"
function bucketKey(dateStr, granularity) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  if (granularity === "month") return dateStr.slice(0, 7);
  if (granularity === "day") return dateStr.slice(0, 10);
  // week: snap to Monday (UTC)
  const day = d.getUTCDay();               // 0 Sun … 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff));
  return monday.toISOString().slice(0, 10);
}

// Build the ordered list of bucket keys (oldest → newest) for a granularity.
function bucketKeys(granularity) {
  const n = GRANULARITY_CONFIG[granularity].buckets;
  const keys = [];
  const now = new Date();
  if (granularity === "month") {
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      keys.push(d.toISOString().slice(0, 7));
    }
  } else if (granularity === "day") {
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      keys.push(d.toISOString().slice(0, 10));
    }
  } else {
    // week — walk back n Mondays
    const todayKey = bucketKey(now.toISOString(), "week");
    let monday = new Date(todayKey + "T00:00:00.000Z");
    for (let i = 0; i < n; i++) {
      keys.push(monday.toISOString().slice(0, 10));
      monday = new Date(monday.getTime() - 7 * 86400000);
    }
    keys.reverse();
  }
  return keys;
}

// Pretty label for a bucket key + granularity (for the chart X axis).
function prettyBucket(key, granularity) {
  if (granularity === "month") return prettyMonth(key);
  if (granularity === "day") return key.slice(5);       // "MM-DD"
  // week → "w/c DD Mon"
  const d = new Date(key + "T00:00:00.000Z");
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

// The earliest ISO timestamp we need to fetch to fill the buckets for a granularity.
function windowStart(granularity) {
  const keys = bucketKeys(granularity);
  const first = keys[0];
  if (granularity === "month") return new Date(first + "-01T00:00:00.000Z").toISOString();
  return new Date(first + "T00:00:00.000Z").toISOString();
}

// Given raw rows with a timestamp field, produce chart data for a granularity.
// countMode: "count" (rows per bucket) or "distinctUser" (distinct user_id per bucket).
function bucketize(rows, tsField, granularity, { distinctUser = false, userField = "user_id", filter = null } = {}) {
  const keys = bucketKeys(granularity);
  const counts = Object.fromEntries(keys.map(k => [k, distinctUser ? new Set() : 0]));
  (rows || []).forEach(r => {
    if (filter && !filter(r)) return;
    const k = bucketKey(r[tsField] || "", granularity);
    if (counts[k] === undefined) return;
    if (distinctUser) counts[k].add(r[userField]);
    else counts[k] += 1;
  });
  return keys.map(k => ({
    x: prettyBucket(k, granularity),
    value: distinctUser ? counts[k].size : counts[k],
  }));
}

// Sessions split into home vs spot per bucket (for the stacked sessions chart).
function bucketizeSessions(rows, granularity) {
  const keys = bucketKeys(granularity);
  const total = Object.fromEntries(keys.map(k => [k, 0]));
  const home = Object.fromEntries(keys.map(k => [k, 0]));
  (rows || []).forEach(s => {
    const k = bucketKey(s.trained_at || "", granularity);
    if (total[k] === undefined) return;
    total[k] += 1;
    if (!s.spot_id) home[k] += 1;
  });
  return keys.map(k => ({
    x: prettyBucket(k, granularity),
    spotSessions: total[k] - home[k],
    homeSessions: home[k],
  }));
}

export default function AdminDashboard() {
  const [authState, setAuthState] = useState("loading"); // loading | signedOut | notAdmin | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [granularity, setGranularity] = useState("month"); // day | week | month

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
    const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // ----- Headline totals -----
    const [{ count: totalUsers }, { count: totalSessions }, { count: proUsers }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("sessions").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_pro", true),
    ]);

    // ----- Current MAU (last 30d, any session incl. home sessions) -----
    // Derived from the fully-paged sessionRows below (see fetchAllRows) to avoid the 1000-row cap.
    // (Computed after sessionRows is fetched.)

    // ----- Raw rows over the WIDEST window we might chart (monthly = furthest back). -----
    // We fetch once and bucket client-side so the Day/7-day/Month toggle needs no refetch.
    // NOTE: Supabase caps a single query at 1000 rows, so we PAGE through with .range()
    // to get every row — otherwise recent buckets go blank once you pass 1000 signups/sessions.
    const rawStart = windowStart("month");

    async function fetchAllRows(table, columns, tsColumn) {
      const pageSize = 1000;
      let from = 0;
      let all = [];
      // Hard stop at 100k rows so a bug can't loop forever.
      for (let guard = 0; guard < 100; guard++) {
        const { data, error } = await supabase
          .from(table)
          .select(columns)
          .gte(tsColumn, rawStart)
          .order(tsColumn, { ascending: true })
          .range(from, from + pageSize - 1);
        if (error) {
          console.error(`fetchAllRows(${table}) failed:`, error);
          break;
        }
        all = all.concat(data || []);
        if (!data || data.length < pageSize) break; // last page
        from += pageSize;
      }
      return all;
    }

    // Signups (raw created_at rows) — paged
    const signupRows = await fetchAllRows("profiles", "created_at", "created_at");

    // Sessions (NO spot filter — home sessions included) — paged
    const sessionRows = await fetchAllRows("sessions", "user_id, trained_at, spot_id", "trained_at");

    // MAU: distinct users with a session in the last 30 days, from the paged rows.
    const mau = new Set(
      (sessionRows || [])
        .filter(s => (s.trained_at || "") >= month)
        .map(s => s.user_id)
    ).size;

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
      proUsers: proUsers ?? 0,
      mau,
      signupRows: signupRows || [],
      sessionRows: sessionRows || [],
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

  // Derive the four toggle-able series from raw rows at the selected granularity.
  const signupsSeries = bucketize(metrics.signupRows, "created_at", granularity);
  const activeUsersSeries = bucketize(metrics.sessionRows, "trained_at", granularity, { distinctUser: true });
  const sessionsSeries = bucketizeSessions(metrics.sessionRows, granularity);

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
          <BigMetric
            label="Pro users"
            value={metrics.proUsers.toLocaleString()}
            subtitle={
              metrics.totalUsers > 0
                ? `${((metrics.proUsers / metrics.totalUsers) * 100).toFixed(1)}% of users`
                : "Active Pro subscribers"
            }
          />
          <BigMetric label="Total sessions" value={metrics.totalSessions.toLocaleString()} subtitle="All workouts logged (incl. home sessions)" />
          <BigMetric label="Active users" value={metrics.mau.toLocaleString()} subtitle="Trained in the last 30 days" />
        </div>
      </Section>

      {/* Granularity toggle — controls the four charts below */}
      <div style={styles.toggleRow}>
        <span style={styles.toggleLabel}>View by:</span>
        <GranularityToggle value={granularity} onChange={setGranularity} />
      </div>

      {/* Signups */}
      <Section title="New users" subtitle="How many people signed up per bucket. The core growth line.">
        <SeriesBarChart data={signupsSeries} dataKey="value" color="#1F2E5C" />
      </Section>

      {/* Sessions, split home vs spot */}
      <Section
        title="Sessions logged"
        subtitle="Total workouts logged per bucket — including home sessions (no spot) as well as sessions at a spot. This is overall engagement."
      >
        <SeriesSessionsChart data={sessionsSeries} />
      </Section>

      {/* Active users */}
      <Section title="Active users" subtitle="Distinct people who logged at least one session in each bucket.">
        <SeriesBarChart data={activeUsersSeries} dataKey="value" color="#10B981" />
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

      {/* Signups trend line — same data as the signups bars, as a line for trend readability */}
      <Section title="New users — trend line" subtitle="The signups above as a line, at the selected granularity, for trend readability.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={signupsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1F2E5C" strokeWidth={2} />
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

// Day / 7-day / Month toggle.
function GranularityToggle({ value, onChange }) {
  const opts = [
    { key: "day", label: "Day" },
    { key: "week", label: "7-day" },
    { key: "month", label: "Month" },
  ];
  return (
    <div style={styles.toggleGroup}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            ...styles.toggleBtn,
            ...(value === o.key ? styles.toggleBtnActive : {}),
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Generic single-series bar chart (X axis key = "x").
function SeriesBarChart({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="x" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Stacked: spot sessions + home sessions = total, so the home contribution is visible.
function SeriesSessionsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="x" tick={{ fontSize: 13 }} />
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
  toggleRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  toggleLabel: { fontSize: 13, color: "#6B7280", fontWeight: 500 },
  toggleGroup: { display: "inline-flex", border: "1px solid #D1D5DB", borderRadius: 8, overflow: "hidden" },
  toggleBtn: { padding: "8px 16px", background: "white", border: "none", borderRight: "1px solid #E5E7EB", cursor: "pointer", fontSize: 14, color: "#374151" },
  toggleBtnActive: { background: "#1F2E5C", color: "white" },
};