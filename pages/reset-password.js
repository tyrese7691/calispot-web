import { useEffect, useState } from "react";
import Head from "next/head";

export default function ResetPassword() {
  const [deepLink, setDeepLink] = useState("calispot://reset-password");
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    // Build deep link forwarding the ?code= query param Supabase appends
    const link = "calispot://reset-password" + window.location.search;
    setDeepLink(link);

    // Attempt redirect after short delay so page renders first
    const redirectTimer = setTimeout(() => {
      window.location.href = link;
    }, 300);

    // Show manual button after 2.5s in case app didn't open
    const fallbackTimer = setTimeout(() => {
      setShowManual(true);
    }, 2500);

    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Opening CaliSpot…</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{
          background:#0d0d0d;
          color:#fff;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:24px;
        }
        .card{max-width:360px;width:100%}
        .logo{width:64px;height:64px;border-radius:50%;display:block;margin:0 auto 20px}
        .brand{font-size:11px;font-weight:700;letter-spacing:4px;color:#F5C842;text-transform:uppercase;margin-bottom:32px}
        h1{font-size:22px;font-weight:800;color:#fff;margin-bottom:10px}
        p{font-size:15px;color:#888;line-height:1.6;margin-bottom:32px}
        .btn{
          display:inline-block;
          padding:14px 32px;
          background:#F5C842;
          color:#0d0d0d;
          font-weight:800;
          font-size:15px;
          border-radius:10px;
          text-decoration:none;
          width:100%;
        }
        .spinner{
          width:32px;height:32px;
          border:3px solid #222;
          border-top-color:#F5C842;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
          margin:0 auto 20px;
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="card">
        <img
          src="https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/images/logos/calilogobg.png"
          alt="CaliSpot"
          className="logo"
        />
        <p className="brand">CALISPOT</p>

        {!showManual ? (
          <>
            <div className="spinner" />
            <h1>Opening app…</h1>
            <p>You&apos;ll be redirected to CaliSpot to set your new password.</p>
          </>
        ) : (
          <>
            <h1>Tap to open CaliSpot</h1>
            <p>
              If the app didn&apos;t open automatically, tap the button below.
              Make sure CaliSpot is installed.
            </p>
            <a href={deepLink} className="btn">
              Open CaliSpot
            </a>
          </>
        )}
      </div>
    </>
  );
}