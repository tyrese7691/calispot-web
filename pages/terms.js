import Head from "next/head";
import Link from "next/link";
const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";
export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — CaliSpot</title>
        <meta name="description" content="Terms of Service for CaliSpot — the rules of using our app and website." />
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
        .body strong{color:rgba(255,255,255,.85);font-weight:700}
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
        <h1>Terms of<br />Service</h1>
        <div className="meta">Last updated: May 2026</div>

        <div className="body">

          <h2>1. About These Terms</h2>
          <p>
            Welcome to CaliSpot. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the
            CaliSpot iOS and Android apps and the calispot.xyz website (together, the
            &ldquo;Service&rdquo;). The Service is operated by CALISPOT LTD (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;, &ldquo;our&rdquo;), a company registered in England and Wales.
          </p>
          <p>
            By creating an account or otherwise using the Service, you agree to these Terms. If you
            don&apos;t agree, please don&apos;t use the Service.
          </p>
          <p>Contact: <a href="mailto:support@calispot.xyz">support@calispot.xyz</a></p>

          <div className="divider" />

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use CaliSpot. If you&apos;re under 18, you must
            have permission from a parent or legal guardian. By using the Service, you confirm
            that you meet these requirements.
          </p>

          <div className="divider" />

          <h2>3. Your Account</h2>
          <p>
            You&apos;re responsible for keeping your account secure. That means choosing a strong
            password, not sharing your login, and letting us know promptly if you think someone
            else has accessed your account.
          </p>
          <p>
            You&apos;re responsible for everything that happens through your account. We&apos;re not
            liable for losses caused by unauthorised use of your account if you didn&apos;t take
            reasonable steps to protect it.
          </p>

          <div className="divider" />

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service to break any law or regulation</li>
            <li>Post or share content that is illegal, harassing, hateful, threatening, sexually explicit, or otherwise inappropriate</li>
            <li>Impersonate another person or misrepresent your affiliation with anyone</li>
            <li>Submit false spot information, fake reviews, or manipulated session data</li>
            <li>Spam other users, send unsolicited messages, or scrape data from the Service</li>
            <li>Reverse-engineer, decompile, or attempt to extract the source code of the apps</li>
            <li>Use the Service to promote a competing app or service without our written permission</li>
            <li>Interfere with the Service&apos;s normal operation, servers, or networks</li>
            <li>Use automated tools or bots to access or interact with the Service</li>
          </ul>
          <p>
            We may suspend or delete accounts that violate these rules, sometimes without warning if
            the violation is serious.
          </p>

          <div className="divider" />

          <h2>5. User Content</h2>
          <p>
            CaliSpot lets you post content — spots, reviews, session photos, crew posts, event
            descriptions, and more (&ldquo;User Content&rdquo;). You retain ownership of everything
            you post.
          </p>
          <p>
            By posting User Content, you grant us a worldwide, non-exclusive, royalty-free licence
            to host, display, distribute, and use it within the Service. This licence is solely so
            we can run CaliSpot — show your sessions in the feed, display your photos on spot pages,
            include your crew posts in your crew feed, etc.
          </p>
          <p>You confirm that:</p>
          <ul>
            <li>You own the rights to whatever you post, or have permission to share it</li>
            <li>Your content doesn&apos;t infringe anyone else&apos;s intellectual property, privacy, or other rights</li>
            <li>You&apos;re responsible for your content — we don&apos;t endorse or verify it</li>
          </ul>
          <p>
            We may remove User Content that violates these Terms or that we reasonably believe is
            harmful, illegal, or inappropriate.
          </p>

          <div className="divider" />

          <h2>6. Spot Submissions</h2>
          <p>
            Anyone can submit a calisthenics spot to the map. Submissions are reviewed before
            publication. We may edit, reject, or remove submissions at our discretion — for
            example, if the spot doesn&apos;t exist, is on private property, is duplicated, or
            doesn&apos;t fit the platform.
          </p>
          <p>
            By submitting a spot, you confirm the information is accurate to the best of your
            knowledge and that you have the right to share any photos included.
          </p>

          <div className="divider" />

          <h2>7. Crews and Events</h2>
          <p>
            Crews are user-organised groups. Crew leaders are responsible for moderating their
            crews — kicking abusive members, removing inappropriate posts, etc. We may step in if
            a crew or its leadership violates these Terms.
          </p>
          <p>
            Events posted on CaliSpot are organised by users, not by us. We don&apos;t verify them
            or guarantee they&apos;ll happen as advertised. Attend at your own discretion.
          </p>

          <div className="divider" />

          <h2>8. Subscriptions and Purchases</h2>
          <p>
            CaliSpot is free to use. We offer a paid subscription called CaliSpot Pro and one-off
            in-app purchases (e.g. promoting an event).
          </p>
          <p>
            Subscriptions are billed by Apple (App Store) or Google (Play Store). They auto-renew
            unless you cancel at least 24 hours before the end of the current billing period.
            Pricing is shown in the app before you purchase.
          </p>
          <p>
            Refund policies are governed by Apple and Google — we don&apos;t process payments
            directly and can&apos;t issue refunds. To request a refund:
          </p>
          <ul>
            <li><strong>App Store:</strong> visit reportaproblem.apple.com</li>
            <li><strong>Google Play:</strong> visit play.google.com/store/account/orders</li>
          </ul>
          <p>
            Where you have a statutory right to a refund under UK consumer law (e.g. faulty
            service), we&apos;ll honour it.
          </p>

          <div className="divider" />

          <h2>9. Free Tier and Pro Features</h2>
          <p>
            We may change which features are free vs Pro from time to time. We&apos;ll generally try
            to give existing users notice before removing access to a feature they previously had,
            but reserve the right to make changes if necessary.
          </p>

          <div className="divider" />

          <h2>10. AI-Generated Content</h2>
          <p>
            CaliSpot includes an AI training assistant called CaliBot. CaliBot generates workout
            plans, daily focus suggestions, weekly reports, and per-session insights using
            information you&apos;ve logged in the app.
          </p>
          <p>
            CaliBot is a guidance tool, not a substitute for professional medical, fitness, or
            physiotherapy advice. AI-generated workouts may not be appropriate for every body or
            every situation. You&apos;re responsible for deciding what&apos;s safe for you to
            attempt.
          </p>
          <p>
            If you have a health condition, are recovering from injury, or are unsure about an
            exercise, consult a qualified professional before training. Don&apos;t attempt anything
            that feels unsafe.
          </p>

          <div className="divider" />

          <h2>11. Physical Activity Disclaimer</h2>
          <p>
            CaliSpot is about outdoor calisthenics training. Calisthenics involves physical
            activity that carries inherent risks of injury. By using the Service, you acknowledge
            and accept these risks.
          </p>
          <p>
            We don&apos;t inspect, maintain, or own the spots on the map. The condition of bars,
            equipment, and surfaces is the responsibility of whoever owns or maintains them
            (typically councils or private landowners). Always check equipment before training.
          </p>
          <p>
            Train within your ability. Consult a doctor if you have any concerns about your
            fitness to exercise.
          </p>

          <div className="divider" />

          <h2>12. Intellectual Property</h2>
          <p>
            The CaliSpot name, logo, app design, code, illustrations, and content created by us are
            owned by CALISPOT LTD and protected by copyright, trademark, and other laws. You
            can&apos;t copy, modify, distribute, or create derivative works from our materials
            without our written permission.
          </p>
          <p>
            User Content remains owned by the user who posted it (see Section 5).
          </p>
          <p>
            The CaliSpot spot database, spot photographs, ratings, and related content are
            proprietary to CALISPOT LTD and provided solely for your personal, non-commercial use
            within the Service. You may not access the Service by automated means (bots, scrapers,
            crawlers), or extract, copy, harvest, cache, or store the spot data or images in bulk,
            or use them to build, train, or populate any competing or derivative product or
            dataset. We may rate-limit, suspend, or permanently ban any account that does so, and
            pursue all available remedies.
          </p>

          <div className="divider" />

          <h2>13. Third-Party Services</h2>
          <p>
            CaliSpot uses third-party services to operate (Supabase, Firebase, OneSignal, Apple,
            Google, Cloudflare, Anthropic). These services have their own terms and privacy
            practices. By using CaliSpot, you accept that some of your data is processed by
            these providers. Details are in our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            CaliSpot may also include links to third-party websites or services (e.g. Amazon
            affiliate links in the Shop tab). We&apos;re not responsible for those sites&apos;
            content or practices.
          </p>

          <div className="divider" />

          <h2>14. Service Availability</h2>
          <p>
            We try hard to keep CaliSpot running, but we don&apos;t guarantee it&apos;ll be
            available 24/7 without interruption. We may take the Service down for maintenance,
            updates, or emergencies. We&apos;re not liable for losses caused by downtime.
          </p>
          <p>
            We may add, change, or remove features at any time. We&apos;ll usually announce
            significant changes in the app or by email.
          </p>

          <div className="divider" />

          <h2>15. Termination</h2>
          <p>
            You can stop using CaliSpot any time. To delete your account, follow the steps on our{" "}
            <Link href="/delete-account">Delete Account</Link> page.
          </p>
          <p>
            We may suspend or terminate your account if you violate these Terms, or if we believe
            (acting reasonably) that doing so is necessary to protect the Service or other users.
            Where possible we&apos;ll give you a heads-up first, but we may act immediately if the
            situation is serious.
          </p>
          <p>
            Sections of these Terms that by their nature should survive termination (e.g.
            intellectual property, disclaimers, limitation of liability) will continue after your
            account ends.
          </p>

          <div className="divider" />

          <h2>16. Disclaimers</h2>
          <p>
            Subject to applicable law, the Service is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo;. We make no warranties — express or implied — about the Service&apos;s
            reliability, accuracy, or fitness for a particular purpose, beyond what UK consumer
            law requires us to provide.
          </p>
          <p>
            We don&apos;t guarantee that spot data is up to date, that AI-generated workouts are
            optimal, or that user-posted content is accurate.
          </p>

          <div className="divider" />

          <h2>17. Limitation of Liability</h2>
          <p>
            Nothing in these Terms limits or excludes our liability for death or personal injury
            caused by our negligence, for fraud or fraudulent misrepresentation, or for anything
            else that can&apos;t be limited or excluded under UK law.
          </p>
          <p>
            Subject to that, our total liability to you for any claim arising out of your use of
            the Service is limited to the greater of: (a) the amount you&apos;ve paid us for the
            Service in the 12 months before the claim arose, or (b) £50.
          </p>
          <p>
            We&apos;re not liable for indirect, incidental, or consequential losses — for example,
            lost profits, lost data, or training injuries — except where required by law.
          </p>

          <div className="divider" />

          <h2>18. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make significant changes,
            we&apos;ll let you know in the app or by email at least 14 days before they take
            effect. Your continued use of the Service after the changes take effect means you
            accept the updated Terms.
          </p>

          <div className="divider" />

          <h2>19. Governing Law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any disputes will be
            resolved in the courts of England and Wales, except that nothing in this section
            removes consumer rights you may have to bring a claim in your country of residence.
          </p>

          <div className="divider" />

          <h2>20. Contact</h2>
          <p>
            For any questions about these Terms, email{" "}
            <a href="mailto:support@calispot.xyz">support@calispot.xyz</a>.
          </p>
          <p>
            CALISPOT LTD &middot; Registered in England and Wales.
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
          <Link href="/terms">Terms of Service</Link>
          <Link href="/delete-account">Delete Account</Link>
          <a href="mailto:support@calispot.xyz">Contact</a>
          <a href="https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360" target="_blank" rel="noreferrer">App Store</a>
          <a href="https://www.instagram.com/calispot.xyz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="fcp">&copy; 2026 Tyrese Bewry &middot; CALISPOT LTD</div>
      </footer>
    </>
  );
}