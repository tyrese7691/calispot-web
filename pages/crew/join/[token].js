// pages/crew/join/[token].js
// CaliSpot — Crew join deep link redirect page
//
// Place this file at: pages/crew/join/[token].js in your Vercel / Next.js project.
//
// What it does:
//   1. On load, immediately redirects to calispot://crew/join/{token}
//   2. Shows a fallback UI with an "Open in CaliSpot" button for users
//      whose browser blocks automatic deep link redirects (e.g. Instagram)
//   3. Shows App Store link if the app isn't installed

import { useEffect, useState } from "react";
import Head from "next/head";

export default function CrewJoinPage({ token }) {
  const [crewName, setCrewName] = useState(null);
  const [launched, setLaunched] = useState(false);

  const deepLink = `calispot://crew/join/${token}`;
  const appStoreURL = "https://apps.apple.com/app/id6747050360";

  // Fetch crew name from Supabase for a nicer preview
  useEffect(() => {
    if (!token) return;
    fetch(
      `https://nrfwyewylurdmsnxycwz.supabase.co/rest/v1/crews?join_token=eq.${token}&select=name`,
      {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnd5ZXd5bHVyZG1zbnh5Y3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc4MTIsImV4cCI6MjA4NzA5MzgxMn0.QJCdBm0Fa3xX1TsOJ5bLEodKpcgGjniz8vEM-_RA8wc",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnd5ZXd5bHVyZG1zbnh5Y3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc4MTIsImV4cCI6MjA4NzA5MzgxMn0.QJCdBm0Fa3xX1TsOJ5bLEodKpcgGjniz8vEM-_RA8wc",
        },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data && data[0]?.name) setCrewName(data[0].name);
      })
      .catch(() => {});
  }, [token]);

  // Auto-redirect to deep link on mount
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      window.location.href = deepLink;
      setLaunched(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [token, deepLink]);

  const title = crewName
    ? `Join ${crewName} on CaliSpot`
    : "Join a Crew on CaliSpot";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="You've been invited to join a workout crew on CaliSpot." />
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Train together. Join the crew on CaliSpot." />
        <meta property="og:image" content="https://www.calispot.xyz/og-image.png" />
        {/* Prevent robots indexing join links */}
        <meta name="robots" content="noindex" />
        {/* iOS Smart App Banner */}
        <meta name="apple-itunes-app" content={`app-id=6747050360, app-argument=${deepLink}`} />
      </Head>

      <main style={styles.container}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <img src="/images/calilogobg.png" alt="CaliSpot" style={styles.logo} />
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>
          {crewName ? `Join "${crewName}"` : "You're invited to a crew"}
        </h1>
        <p style={styles.sub}>
          Open CaliSpot to accept the invite and see upcoming sessions.
        </p>

        {/* Primary CTA */}
        <a href={deepLink} style={styles.primaryBtn}>
          Open in CaliSpot
        </a>

        {/* Fallback — App Store */}
        <a href={appStoreURL} style={styles.secondaryBtn}>
          Download CaliSpot
        </a>

        {launched && (
          <p style={styles.hint}>
            If the app didn&apos;t open,{" "}
            <a href={deepLink} style={styles.link}>
              tap here
            </a>
            .
          </p>
        )}
      </main>
    </>
  );
}

// Server-side: read token from URL
export async function getServerSideProps(context) {
  const { token } = context.params;
  return { props: { token: token || null } };
}

// ─── Inline styles (no external CSS dependency) ──────────────────────────────

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#ffffff",
    textAlign: "center",
  },
  logoWrap: {
    marginBottom: "28px",
  },
  logo: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    objectFit: "cover",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    margin: "0 0 12px",
    lineHeight: "1.2",
  },
  sub: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.55)",
    margin: "0 0 36px",
    maxWidth: "320px",
    lineHeight: "1.5",
  },
  primaryBtn: {
    display: "inline-block",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "700",
    padding: "14px 40px",
    borderRadius: "14px",
    textDecoration: "none",
    marginBottom: "14px",
    width: "100%",
    maxWidth: "320px",
    boxSizing: "border-box",
  },
  secondaryBtn: {
    display: "inline-block",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.7)",
    fontSize: "15px",
    fontWeight: "600",
    padding: "12px 32px",
    borderRadius: "12px",
    textDecoration: "none",
    width: "100%",
    maxWidth: "320px",
    boxSizing: "border-box",
  },
  hint: {
    marginTop: "24px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
  },
  link: {
    color: "rgba(255,255,255,0.6)",
  },
};
