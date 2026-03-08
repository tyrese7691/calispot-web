// pages/confirm-email.js
// Supabase redirects here after the user taps the confirmation link in their email.
// We extract the token_hash + type and redirect into the app via deep link.
// If the app isn't installed (web browser only), we show a fallback message.

import { useEffect, useState } from "react";
import Head from "next/head";

export default function ConfirmEmail() {
  const [status, setStatus] = useState("confirming"); // "confirming" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    // Supabase PKCE: after server-side token verification it redirects here with ?code=xxx
    // We pass that code straight to the app via deep link; the app calls exchangeCodeForSession.
    const code  = params.get("code");
    const error = params.get("error_description") || params.get("error");

    if (error) {
      setErrorMsg(error);
      setStatus("error");
      return;
    }

    if (!code) {
      setErrorMsg("No confirmation code found in the link. Please try signing up again.");
      setStatus("error");
      return;
    }

    // Build the deep link — AppEntryView handles calispot://confirm-email
    const deepLink = `calispot://confirm-email?code=${encodeURIComponent(code)}`;

    // Try to open the app. After a short delay, if we're still here, show success
    // (the browser usually suppresses the "app not found" error anyway).
    window.location.href = deepLink;

    // Show success UI after 1.5s — if the app opened, the user won't see this.
    setTimeout(() => setStatus("success"), 1500);
  }, []);

  return (
    <>
      <Head>
        <title>Confirming your CaliSpot account…</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.container}>
        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoRow}>
            <span style={styles.logoText}>CALISPOT</span>
          </div>

          {status === "confirming" && (
            <>
              <div style={styles.icon}>⏳</div>
              <h1 style={styles.heading}>Opening CaliSpot…</h1>
              <p style={styles.body}>
                Confirming your account and launching the app.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div style={styles.icon}>✅</div>
              <h1 style={styles.heading}>Email confirmed!</h1>
              <p style={styles.body}>
                Your account is active. If the app didn&apos;t open automatically,{" "}
                <a href="calispot://confirm-email" style={styles.link}>
                  tap here to open CaliSpot
                </a>
                .
              </p>
              <a
                href="https://apps.apple.com/app/id6747050360"
                style={styles.button}
              >
                Download CaliSpot
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <div style={styles.icon}>❌</div>
              <h1 style={styles.heading}>Link expired</h1>
              <p style={styles.body}>
                {errorMsg ||
                  "This confirmation link has expired or already been used. Please sign up again."}
              </p>
              <a href="https://calispot.xyz" style={styles.button}>
                Back to CaliSpot
              </a>
            </>
          )}
        </div>
      </main>
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "24px",
  },
  card: {
    background: "#161616",
    borderRadius: "20px",
    padding: "40px 32px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  logoRow: {
    marginBottom: "28px",
  },
  logoText: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "4px",
    color: "#F5C842",
  },
  icon: {
    fontSize: "52px",
    marginBottom: "16px",
  },
  heading: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 12px",
  },
  body: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 24px",
  },
  link: {
    color: "#F5C842",
    textDecoration: "underline",
  },
  button: {
    display: "inline-block",
    background: "#F5C842",
    color: "#000",
    fontWeight: "700",
    fontSize: "15px",
    padding: "14px 28px",
    borderRadius: "12px",
    textDecoration: "none",
    marginTop: "8px",
  },
};