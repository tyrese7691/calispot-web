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
        nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;border-bottom:1px solid var(--bd);background:rgba(10,10,10,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);position:sticky;top:0;z-index:900}
        .nl{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nl-logo{width:51px;height:51px;border-radius:50%;overflow:hidden;background:#fff;flex-shrink:0}
        .nl-logo img{width:100%;height:100%;object-fit:cover;display:block}
        .nl-name{font-size:1rem;font-weight:800;letter-spacing:-.02em;color:var(--w)}
        .nbtn{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0d0d0d;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.6rem 1.4rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nbtn:hover{transform:scale(1.05);box-shadow:0 0 28px rgba(245,200,66,.5)}
        .wrap{max-width:680px;margin:0 auto;padding:80px 48px 120px}
        .eyb{font-family:var(--mono);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:1.4rem;display:flex;align-items:center;gap:.7rem}
        .eyb::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}
        h1{font-size:clamp(3rem,8vw,6rem);font-weight:900;line-height:.9;letter-spacing:-.04em;color:#fff;margin-bottom:3rem}
        .meta{font-family:var(--mono);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--wm);margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid var(--bd)}
        .body p{font-size:1rem;font-weight:400;line-height:1.8;color:rgba(255,255,255,.6);margin-bottom:1.4rem}
        .body p:last-child{margin-bottom:0}
        .body a{color:var(--y);text-decoration:underline;text-underline-offset:3px;transition:opacity .15s}
        .body a:hover{opacity:.75}
        .body h2{font-size:1.4rem;font-weight:800;color:var(--w);margin-top:3rem;margin-bottom:1rem;letter-spacing:-.02em}
        .body h3{font-size:1.05rem;font-weight:700;color:rgba(255,255,255,.7);margin-top:2rem;margin-bottom:.8rem}
        .body ul{list-style:none;margin-bottom:1.4rem}
        .body ul li{font-size:1rem;line-height:1.8;color:rgba(255,255,255,.6);padding-left:1.2rem;position:relative;margin-bottom:.4rem}
        .body ul li::before{content:'';position:absolute;left:0;top:.7em;width:6px;height:6px;border-radius:50%;background:var(--g)}
        .body table{width:100%;border-collapse:collapse;margin-bottom:1.8rem;font-size:.88rem}
        .body th{text-align:left;padding:10px 12px;color:rgba(255,255,255,.35);font-family:var(--mono);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--bd)}
        .body td{padding:10px 12px;color:rgba(255,255,255,.55);border-bottom:1px solid rgba(255,255,255,.04);line-height:1.5}
        .divider{height:1px;background:var(--bd);margin:2.8rem 0}
        .back-wrap{margin-top:4rem;padding-top:2.4rem;border-top:1px solid var(--bd)}
        .back-btn{display:inline-flex;align-items:center;gap:8px;color:#0d0d0d;background:var(--y);font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.85rem 1.8rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .back-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(245,200,66,.4)}
        .back-btn svg{flex-shrink:0}
        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
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
        </Link>
        <a href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360" className="nbtn" target="_blank" rel="noreferrer">
          Download on iOS
        </a>
      </nav>

      {/* CONTENT */}
      <div className="wrap">
        <div className="eyb">Legal</div>
        <h1>Privacy<br />Policy</h1>
        <div className="meta">Last updated: April 2026</div>

        <div className="body">

          <h2>1. Who We Are</h2>
          <p>
            CaliSpot is operated by 8MIND LTD (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
            We are the data controller for the personal data collected through the CaliSpot iOS app
            and website (calispot.xyz).
          </p>
          <p>Contact: <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a></p>

          <div className="divider" />

          <h2>2. What Data We Collect</h2>

          <h3>Account Data</h3>
          <p>When you create an account, we collect your email address, display name, and password
          (encrypted &mdash; we cannot read it). If you sign in with Apple, we receive only the name
          and email address you choose to share.</p>

          <h3>Profile Data</h3>
          <p>You may optionally provide:</p>
          <ul>
            <li>Borough or city where you train</li>
            <li>Age range (e.g. 18&ndash;24, 25&ndash;34)</li>
            <li>Skill level (Beginner, Intermediate, Advanced)</li>
            <li>Instagram username</li>
            <li>Avatar emoji</li>
          </ul>

          <h3>Usage Data</h3>
          <p>When you use the app, we collect session check-ins (which spot, date, duration),
          spot ratings, event attendance, crew membership and activity, and favourite spots.</p>

          <h3>Device Data</h3>
          <p>We collect limited technical data: device type, OS version, push notification token
          (via OneSignal), and approximate location (only when you grant permission, used to show
          nearby spots).</p>

          <div className="divider" />

          <h2>3. Why We Collect This Data</h2>
          <table>
            <thead>
              <tr><th>Data</th><th>Purpose</th><th>Legal Basis</th></tr>
            </thead>
            <tbody>
              <tr><td>Email &amp; password</td><td>Account creation and authentication</td><td>Contract</td></tr>
              <tr><td>Display name, avatar</td><td>Showing your identity in the app</td><td>Contract</td></tr>
              <tr><td>Borough, age, skill level</td><td>Personalising your experience</td><td>Legitimate interest</td></tr>
              <tr><td>Session check-ins, ratings</td><td>Core app features (streaks, stats, quality)</td><td>Contract</td></tr>
              <tr><td>Profile data (aggregated)</td><td>Generating anonymised insights reports</td><td>Legitimate interest</td></tr>
              <tr><td>Push notification token</td><td>Event and crew notifications</td><td>Consent</td></tr>
              <tr><td>Location data</td><td>Showing nearby spots on the map</td><td>Consent</td></tr>
            </tbody>
          </table>

          <div className="divider" />

          <h2>4. Anonymised Insights</h2>
          <p>
            We generate anonymised, aggregated reports about outdoor fitness usage patterns.
            These reports contain statistics such as &ldquo;120 users aged 18&ndash;34 train outdoors
            in Wandsworth&rdquo; &mdash; they never identify individual users.
          </p>
          <p>We may share these anonymised insights with:</p>
          <ul>
            <li>Local councils (to improve outdoor fitness infrastructure)</li>
            <li>Sports organisations (e.g. Sport England, London Sport)</li>
            <li>Fitness equipment manufacturers</li>
            <li>Academic researchers</li>
          </ul>
          <p>
            No individual user data is ever shared. All insights are aggregated and anonymised
            before sharing. It is not possible to identify any individual from these reports.
          </p>

          <div className="divider" />

          <h2>5. Third-Party Services</h2>
          <table>
            <thead>
              <tr><th>Service</th><th>Purpose</th><th>Data Shared</th></tr>
            </thead>
            <tbody>
              <tr><td>Supabase</td><td>Database, auth, storage</td><td>Account, profile, usage data</td></tr>
              <tr><td>Firebase (Google)</td><td>Real-time presence</td><td>User ID, spot ID</td></tr>
              <tr><td>OneSignal</td><td>Push notifications</td><td>Device token, user ID</td></tr>
              <tr><td>Apple</td><td>Sign in, In-App Purchases</td><td>Name, email (your choice)</td></tr>
              <tr><td>Amazon Associates</td><td>Affiliate product links</td><td>No personal data</td></tr>
            </tbody>
          </table>
          <p>We do not sell your personal data to any third party.</p>

          <div className="divider" />

          <h2>6. In-App Purchases</h2>
          <p>
            CaliSpot offers optional in-app purchases (e.g. promoting events). These are processed
            by Apple through StoreKit. We do not collect or store any payment information &mdash;
            Apple handles all billing.
          </p>

          <div className="divider" />

          <h2>7. Your Rights (UK GDPR)</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> your data &mdash; request a copy of everything we hold about you</li>
            <li><strong>Correct</strong> your data &mdash; update your profile in the app at any time</li>
            <li><strong>Delete</strong> your data &mdash; use &ldquo;Delete Account&rdquo; in Profile &rarr; Settings, or email us</li>
            <li><strong>Object</strong> to processing &mdash; you can object to our use of your data for anonymised insights</li>
            <li><strong>Data portability</strong> &mdash; request your data in a machine-readable format</li>
            <li><strong>Withdraw consent</strong> &mdash; turn off notifications or location in your device settings</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a>.
            We will respond within 30 days.
          </p>

          <div className="divider" />

          <h2>8. Data Retention</h2>
          <ul>
            <li><strong>Active accounts:</strong> We retain your data for as long as your account is active.</li>
            <li><strong>Deleted accounts:</strong> All personal data is permanently removed. Anonymised statistics that cannot identify you may be retained.</li>
            <li><strong>Session data:</strong> Retained while your account is active and deleted when your account is deleted.</li>
          </ul>

          <div className="divider" />

          <h2>9. Data Security</h2>
          <p>
            Your data is stored securely on Supabase servers with row-level security policies.
            Passwords are hashed and cannot be read by us or anyone else.
            All data transmission uses HTTPS encryption.
          </p>

          <div className="divider" />

          <h2>10. Children</h2>
          <p>
            CaliSpot is not directed at children under 13. We do not knowingly collect data from
            children under 13. If you believe a child under 13 has created an account, please
            contact us and we will delete it.
          </p>

          <div className="divider" />

          <h2>11. Cookies</h2>
          <p>
            The CaliSpot website does not use tracking cookies. We use basic analytics to
            understand page visits.
          </p>

          <div className="divider" />

          <h2>12. Changes</h2>
          <p>
            We may update this privacy policy from time to time. If we make significant changes,
            we will notify you through the app. The &ldquo;Last updated&rdquo; date at the top
            shows when the policy was last revised.
          </p>

          <div className="divider" />

          <h2>13. Contact &amp; Complaints</h2>
          <p>
            For any questions about this privacy policy or your data, email{" "}
            <a href="mailto:8mindltd@gmail.com">8mindltd@gmail.com</a>.
          </p>
          <p>
            If you are unhappy with how we handle your data, you have the right to complain to the
            Information Commissioner&apos;s Office (ICO) at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a> or
            call 0303 123 1113.
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