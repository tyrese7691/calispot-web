import { useEffect, useState } from "react";
import Head from "next/head";

export default function ResetPassword() {
  const [deepLink, setDeepLink] = useState("calispot://reset-password");

  useEffect(() => {
    setDeepLink("calispot://reset-password" + window.location.search);
  }, []);

  return (
    <>
      <Head>
        <title>Reset Password — CaliSpot</title>
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
        .brand{font-size:11px;font-weight:700;letter-spacing:4px;color:#0d0d0d;text-transform:uppercase;margin-bottom:32px}
        h1{font-size:22px;font-weight:800;color:#fff;margin-bottom:10px}
        p{font-size:15px;color:#888;line-height:1.6;margin-bottom:32px}
        .btn{
          display:inline-block;
          padding:16px 32px;
          background:#F5C842;
          color:#0d0d0d;
          font-weight:800;
          font-size:16px;
          border-radius:12px;
          text-decoration:none;
          width:100%;
        }
      `}</style>

      <div className="card">
        <img
          src="https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/images/logos/calilogobg.png"
          alt="CaliSpot"
          className="logo"
        />
        <p className="brand">CALISPOT</p>
        <h1>Reset your password</h1>
        <p>Tap below to open CaliSpot and choose your new password.</p>
        <a href={deepLink} className="btn">Open CaliSpot</a>
      </div>
    </>
  );
}