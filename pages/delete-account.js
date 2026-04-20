import Head from "next/head";
import Link from "next/link";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

export default function DeleteAccount() {
  return (
    <>
      <Head>
        <title>Delete Account — CaliSpot</title>
        <meta name="description" content="How to delete your CaliSpot account and associated data." />
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

        /* NAV — matches privacy.js */
        nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;border-bottom:1px solid var(--bd);background:rgba(10,10,10,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);position:sticky;top:0;z-index:900}
        .nl{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nl-logo{width:51px;height:51px;border-radius:50%;overflow:hidden;background:#fff;flex-shrink:0}
        .nl-logo img{width:100%;height:100%;object-fit:cover;display:block}
        .nbtn{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0d0d0d;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.6rem 1.4rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nbtn:hover{transform:scale(1.05);box-shadow:0 0 28px rgba(245,200,66,.5)}

        /* CONTENT */
        .wrap{max-width:820px;margin:0 auto;padding:80px 32px 120px}
        h1{font-size:clamp(2.4rem,5vw,3.4rem);font-weight:900;letter-spacing:-.03em;line-height:1.05;margin-bottom:18px}
        h1 .accent{color:var(--y)}
        .updated{font-family:var(--mono);font-size:.78rem;color:var(--wm);text-transform:uppercase;letter-spacing:.12em;margin-bottom:40px}
        h2{font-size:1.5rem;font-weight:800;letter-spacing:-.015em;margin:36px 0 14px;color:var(--w)}
        h3{font-size:1.05rem;font-weight:700;margin:22px 0 10px;color:var(--y)}
        p{font-size:1rem;line-height:1.65;color:var(--w);margin-bottom:14px}
        p.mute{color:var(--wm);font-size:.92rem}
        strong{font-weight:700;color:var(--w)}
        a{color:var(--g);text-decoration:underline;text-underline-offset:3px}
        a:hover{color:var(--y)}
        ul{margin:10px 0 16px 0;padding-left:0;list-style:none}
        ul li{position:relative;padding-left:22px;line-height:1.65;margin-bottom:8px;color:var(--w);font-size:1rem}
        ul li::before{content:"";position:absolute;left:0;top:10px;width:8px;height:8px;border-radius:50%;background:var(--g)}
        .divider{height:1px;background:var(--bd);margin:28px 0}

        .method-card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:24px 26px;margin:16px 0}
        .method-card h3{margin-top:0;color:var(--y);font-size:1.1rem}
        .method-card p:last-child{margin-bottom:0}
        .method-card ol{margin:10px 0 0 0;padding-left:20px}
        .method-card ol li{line-height:1.65;margin-bottom:6px;color:var(--w)}
        .method-card code{font-family:var(--mono);background:rgba(245,200,66,.08);color:var(--y);padding:2px 6px;border-radius:4px;font-size:.85rem}

        .back-wrap{margin-top:60px}
        .back-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:var(--card);border:1px solid var(--bd);color:var(--w);font-weight:700;font-size:.9rem;text-decoration:none;transition:border-color .2s ease}
        .back-btn:hover{border-color:var(--y);color:var(--y)}

        /* FOOTER — matches privacy.js exactly */
        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .flk{display:flex;gap:2rem;flex-wrap:wrap}
        .flk a{font-family:var(--mono);font-size:.63rem;color:rgba(255,255,255,.2);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .flk a:hover{color:var(--wm)}
        .fcp{font-family:var(--mono);font-size:.56rem;color:rgba(255,255,255,.1)}

        @media (max-width:640px){
          nav{padding:0 24px;height:60px}
          .nl-logo{width:40px;height:40px}
          .wrap{padding:50px 24px 80px}
          h1{font-size:2.1rem}
          h2{font-size:1.25rem}
          .method-card{padding:20px}
          footer{padding-left:24px;padding-right:24px}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
        </Link>
        <a
          href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360"
          target="_blank"
          rel="noreferrer"
          className="nbtn"
        >
          Download on iOS
        </a>
      </nav>

      {/* CONTENT */}
      <div className="wrap">
        <h1>Delete your <span className="accent">account</span></h1>
        <p className="updated">Last updated: April 2026</p>

        <p>
          You can permanently delete your CaliSpot account and the data associated with it at any time.
          There are two ways to do this, depending on whether you still have the app installed.
        </p>

        <h2>How to request deletion</h2>

        <div className="method-card">
          <h3>Option 1 — Delete in-app (fastest)</h3>
          <p>If you still have the CaliSpot app installed:</p>
          <ol>
            <li>Open the <strong>CaliSpot</strong> app</li>
            <li>Go to the <strong>Profile</strong> tab</li>
            <li>Tap <strong>Settings</strong> (gear icon, top right)</li>
            <li>Scroll to the bottom and tap <strong>Delete Account</strong></li>
            <li>Confirm the action</li>
          </ol>
          <p className="mute" style={{marginTop:"14px"}}>
            Your profile and all associated data are removed immediately. You will be signed out.
          </p>
        </div>

        <div className="method-card">
          <h3>Option 2 — Email request (if you&apos;ve uninstalled)</h3>
          <p>
            If you no longer have the app, email us from the email address associated with your
            CaliSpot account:
          </p>
          <ul>
            <li><strong>To:</strong> <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a></li>
            <li><strong>Subject:</strong> <code>Delete my CaliSpot account</code></li>
            <li><strong>Body:</strong> include your display name or the email you signed up with</li>
          </ul>
          <p className="mute" style={{marginTop:"14px"}}>
            We&apos;ll verify the request and process the deletion within 30 days, in line with UK GDPR
            requirements. You&apos;ll receive confirmation by email once complete.
          </p>
        </div>

        <div className="divider" />

        <h2>What gets deleted</h2>
        <p>When your account is deleted, we permanently remove:</p>
        <ul>
          <li>Your profile (name, username, bio, avatar, location)</li>
          <li>Your workout sessions, check-ins, and session history</li>
          <li>Your crew memberships, join requests, and crew announcements you&apos;ve posted</li>
          <li>Your events, event RSVPs, and interest signals</li>
          <li>Your friendships, follows, and friend requests</li>
          <li>Your favourites, skill progress, and XP history</li>
          <li>Your spot reviews, condition reports, and suggestions</li>
          <li>Your challenge history and leaderboard entries</li>
          <li>Your uploaded photos and media</li>
          <li>Your push notification tokens and device identifiers</li>
        </ul>

        <div className="divider" />

        <h2>What we retain (and why)</h2>
        <p>
          For legal, security, and operational reasons, some information is retained after deletion:
        </p>
        <ul>
          <li>
            <strong>Anonymised analytics</strong> — aggregated, non-identifying data about app usage
            (e.g. how many people trained at a given spot) is retained indefinitely. This cannot be
            linked back to you.
          </li>
          <li>
            <strong>Transaction records</strong> — if you&apos;ve made any in-app purchases, records are
            retained for 7 years to comply with UK tax and accounting law.
          </li>
          <li>
            <strong>Abuse-prevention data</strong> — if your account was deleted due to a Terms of
            Service violation, we may retain a hashed identifier to prevent re-registration.
          </li>
          <li>
            <strong>Content posted in shared contexts</strong> — messages or content you posted inside
            a crew or on another user&apos;s content may be retained if removing it would affect other
            users&apos; experience. We can remove this on request.
          </li>
        </ul>

        <div className="divider" />

        <h2>How long does it take?</h2>
        <p>
          In-app deletion is <strong>immediate</strong>. Email-based deletion is processed within
          <strong> 30 days</strong>. Backups are overwritten on a rolling 30-day schedule, so any
          residual data in backups is fully removed within 60 days of the original deletion.
        </p>

        <div className="divider" />

        <h2>Questions or complaints</h2>
        <p>
          If you have questions about account deletion, or if you&apos;re unable to delete your account
          for any reason, contact us at{" "}
          <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a> and we&apos;ll help.
        </p>
        <p>
          You also have the right to complain to the UK Information Commissioner&apos;s Office (ICO)
          at <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a> or by
          calling 0303 123 1113.
        </p>
        <p>
          For full details on how we handle your data, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

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
          <Link href="/delete-account">Delete Account</Link>
          <a href="mailto:8mindltd@gmail.com">Contact</a>
          <a href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360" target="_blank" rel="noreferrer">App Store</a>
          <a href="https://www.instagram.com/calispot.xyz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="fcp">&copy; 2026 Tyrese Bewry &middot; 8MIND LTD</div>
      </footer>
    </>
  );
}