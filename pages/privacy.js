import Head from "next/head";
import Link from "next/link";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — CaliSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={FONTS} rel="stylesheet" />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --y:#F5C842;--g:#3DFF8F;--bg:#0d0d0d;--card:#141414;
          --w:rgba(255,255,255,.92);--wm:rgba(255,255,255,.44);
          --bd:rgba(255,255,255,.07);
          --font:'Bricolage Grotesque',sans-serif;
          --mono:'DM Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:var(--font);overflow-x:hidden;min-height:100vh}

        /* NAV — same as index */
        nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;border-bottom:1px solid var(--bd);background:rgba(13,13,13,.95);backdrop-filter:blur(24px);position:sticky;top:0;z-index:900}
        .nl{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nl-logo{width:34px;height:34px;border-radius:50%;overflow:hidden;background:#fff;flex-shrink:0}
        .nl-logo img{width:100%;height:100%;object-fit:cover;display:block}
        .nl-name{font-size:1rem;font-weight:800;letter-spacing:-.02em;color:var(--w)}
        .nbtn{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0d0d0d;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.6rem 1.4rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nbtn:hover{transform:scale(1.05);box-shadow:0 0 28px rgba(245,200,66,.5)}

        /* PAGE */
        .wrap{max-width:680px;margin:0 auto;padding:80px 48px 120px}

        /* EYEBROW */
        .eyb{font-family:var(--mono);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:1.4rem;display:flex;align-items:center;gap:.7rem}
        .eyb::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}

        /* TITLE */
        h1{font-size:clamp(3rem,8vw,6rem);font-weight:900;line-height:.9;letter-spacing:-.04em;color:#fff;margin-bottom:3rem}

        /* LOGO MARK */
        .logo-mark{display:flex;align-items:center;gap:12px;margin-bottom:3.5rem}
        .logo-mark img{height:52px;width:52px;border-radius:50%;object-fit:cover;background:#fff}
        .logo-mark-name{font-size:1.2rem;font-weight:900;letter-spacing:-.03em;color:rgba(255,255,255,.3)}

        /* METADATA */
        .meta{font-family:var(--mono);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--wm);margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid var(--bd)}

        /* BODY COPY */
        .body p{font-size:1rem;font-weight:400;line-height:1.8;color:rgba(255,255,255,.6);margin-bottom:1.4rem}
        .body p:last-child{margin-bottom:0}
        .body a{color:var(--y);text-decoration:underline;text-underline-offset:3px;transition:opacity .15s}
        .body a:hover{opacity:.75}

        /* SECTION DIVIDERS */
        .divider{height:1px;background:var(--bd);margin:2.8rem 0}

        /* BACK BUTTON */
        .back-wrap{margin-top:4rem;padding-top:2.4rem;border-top:1px solid var(--bd)}
        .back-btn{display:inline-flex;align-items:center;gap:8px;color:#0d0d0d;background:var(--y);font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.85rem 1.8rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .back-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(245,200,66,.4)}
        .back-btn svg{flex-shrink:0}

        /* FOOTER */
        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .flo{font-size:1.4rem;font-weight:900;letter-spacing:-.03em;color:rgba(255,255,255,.18)}
        .flk{display:flex;gap:2rem;flex-wrap:wrap}
        .flk a{font-family:var(--mono);font-size:.63rem;color:rgba(255,255,255,.2);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .flk a:hover{color:var(--wm)}
        .fcp{font-family:var(--mono);font-size:.56rem;color:rgba(255,255,255,.1)}

        @media(max-width:640px){
          nav,.wrap,footer{padding-left:24px;padding-right:24px}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
          <span className="nl-name">CaliSpot</span>
        </Link>
        <a href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360" className="nbtn" target="_blank" rel="noreferrer">
          Download on iOS
        </a>
      </nav>

      {/* CONTENT */}
      <div className="wrap">

        <div className="eyb">Legal</div>
        <h1>Privacy<br />Policy</h1>

        <div className="meta">Last updated: February 2026</div>

        <div className="body">
          <p>
            CaliSpot values your privacy. This website does not collect any personal information.
          </p>
          <p>
            The iOS app may collect limited data to provide features like saving favourites, tracking
            workouts, and seeing who&apos;s training at each spot.
          </p>

          <div className="divider" />

          <p>By using this website, you agree to this privacy policy.</p>

          <p>
            If you have any questions, please contact us at:{" "}
            <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a>
          </p>
        </div>

        <div className="back-wrap">
          <Link href="/" className="back-btn">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to CaliSpot
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="flk">
          <Link href="/privacy">Privacy Policy</Link>
          <a href="mailto:8mindltd@gmail.com">Contact</a>
          <a href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360" target="_blank" rel="noreferrer">App Store</a>
        </div>
        <div className="fcp">© 2026 Tyrese Bewry · 8MIND LTD</div>
      </footer>
    </>
  );
}