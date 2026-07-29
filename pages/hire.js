import Head from "next/head";
import Link from "next/link";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";
const APP_STORE = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.eightmind.calispot";
const EMAIL = "ty.rese@icloud.com";

const LAYERS = [
  ["iOS", "SwiftUI · StoreKit 2 subscriptions · geofenced arrival notifications · deep links & QR joins · Live Activities"],
  ["Android", "Kotlin + Jetpack Compose · Play Billing v8 · full feature parity with iOS · targets API 36"],
  ["Backend", "Supabase Postgres · row-level security · SQL functions enforcing business rules & rate limits · storage · edge functions"],
  ["Web", "Next.js at calispot.xyz · SEO-indexed public spot pages · legal & account flows"],
  ["Payments", "Freemium subscriptions (£9.99/mo, £99.99/yr) with server-enforced feature gating on both platforms"],
  ["Analytics", "Self-hosted event pipeline — no third-party SaaS — plus a custom admin dashboard: retention, usage, growth"],
  ["Ops", "App Store & Play Console releases · review compliance · ASO · localisation (EN/ES/FR) · release signing"],
];

const PROOFS = [
  ["Subscription gating that can't be bypassed", "Pro features are enforced in the database, not just the UI — SQL triggers apply limits and automatically downgrade content when a subscription lapses, so business rules hold even against a modified client."],
  ["Cross-platform parity as one person", "Every feature ships on iOS and Android with matching behaviour — same data layer, same edge cases, same day. Most teams need two engineers for this; I've made it a repeatable workflow."],
  ["App Review, handled", "Location features designed to pass Apple's scrutiny: opt-in geofencing with quiet hours and throttling, no unnecessary background capabilities, privacy strings that say what they mean."],
];

const OFFERS = [
  ["Ship your mobile app", "iOS, Android, or both — from idea to store listing."],
  ["Add revenue", "Subscriptions, in-app purchases, and paywalls implemented properly on both platforms."],
  ["Own a product surface", "I'm used to owning everything from the database schema to the App Store screenshots."],
  ["Move fast without breaking trust", "RLS-first security, review-compliant by design."],
];

export default function Hire() {
  return (
    <>
      <Head>
        <title>Hire Tyrese — Product Engineer | CaliSpot</title>
        <meta name="description" content="I design, build, and ship complete mobile products solo — proof: CaliSpot, a live two-platform app with paying subscribers. Available for contract builds and product engineering roles." />
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
        .nbtn{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0d0d0d;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.6rem 1.4rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nbtn:hover{transform:scale(1.05);box-shadow:0 0 28px rgba(245,200,66,.5)}
        .wrap{max-width:760px;margin:0 auto;padding:80px 48px 120px}
        .eyb{font-family:var(--mono);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:1.4rem;display:flex;align-items:center;gap:.7rem}
        .eyb::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}
        h1{font-size:clamp(2.6rem,7vw,5rem);font-weight:900;line-height:.94;letter-spacing:-.04em;color:#fff;margin-bottom:1.6rem}
        .lede{font-size:1.15rem;line-height:1.7;color:rgba(255,255,255,.65);margin-bottom:2.6rem;max-width:56ch}
        .lede strong{color:var(--w)}
        .cta-row{display:flex;gap:.8rem;flex-wrap:wrap;margin-bottom:4rem}
        .cta{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.85rem 1.7rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .cta.pri{background:var(--y);color:#0d0d0d}
        .cta.pri:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(245,200,66,.4)}
        .cta.sec{border:1px solid rgba(255,255,255,.18);color:var(--w)}
        .cta.sec:hover{border-color:rgba(255,255,255,.4);transform:translateY(-2px)}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:4rem}
        .stat{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:1.6rem 1.2rem;text-align:center}
        .stat b{display:block;font-size:2rem;font-weight:900;letter-spacing:-.03em;color:var(--g)}
        .stat span{font-family:var(--mono);font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:var(--wm)}
        h2{font-size:1.5rem;font-weight:800;letter-spacing:-.02em;color:var(--w);margin-bottom:.6rem}
        .sub{font-size:.95rem;line-height:1.7;color:var(--wm);margin-bottom:1.8rem;max-width:60ch}
        .layers{display:flex;flex-direction:column;gap:8px;margin-bottom:4rem}
        .layer{display:grid;grid-template-columns:110px 1fr;gap:1.2rem;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:1.05rem 1.3rem;align-items:baseline}
        .layer b{font-family:var(--mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--y)}
        .layer p{font-size:.9rem;line-height:1.65;color:rgba(255,255,255,.6)}
        .proofs{display:flex;flex-direction:column;gap:12px;margin-bottom:4rem}
        .proof{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:1.5rem 1.6rem}
        .proof h3{font-size:1.05rem;font-weight:800;letter-spacing:-.01em;color:var(--w);margin-bottom:.5rem}
        .proof h3::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--g);margin-right:.65rem;vertical-align:2px}
        .proof p{font-size:.92rem;line-height:1.7;color:rgba(255,255,255,.55)}
        .offers{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4rem}
        .offer{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:1.4rem 1.5rem}
        .offer h3{font-size:1rem;font-weight:800;color:var(--w);margin-bottom:.45rem}
        .offer p{font-size:.88rem;line-height:1.65;color:rgba(255,255,255,.55)}
        .close{border-top:1px solid var(--bd);padding-top:2.6rem}
        .close p{font-size:1.05rem;line-height:1.75;color:rgba(255,255,255,.65);margin-bottom:1.6rem;max-width:56ch}
        .close p b{color:var(--w)}
        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .flk{display:flex;gap:2rem;flex-wrap:wrap}
        .flk a{font-family:var(--mono);font-size:.63rem;color:rgba(255,255,255,.2);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .flk a:hover{color:var(--wm)}
        .fcp{font-family:var(--mono);font-size:.56rem;color:rgba(255,255,255,.1)}
        @media(max-width:640px){
          nav,.wrap,footer{padding-left:24px;padding-right:24px}
          .stats{grid-template-columns:1fr}
          .offers{grid-template-columns:1fr}
          .layer{grid-template-columns:1fr;gap:.35rem}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
        </Link>
        <a href={`mailto:${EMAIL}`} className="nbtn">Get in touch</a>
      </nav>

      {/* CONTENT */}
      <div className="wrap">
        <div className="eyb">Tyrese Bewry — Product Engineer</div>
        <h1>I ship complete mobile products. Solo.</h1>
        <p className="lede">
          Proof, not promises: <strong>CaliSpot</strong> is a live two-platform app with paying
          subscribers — iOS, Android, backend, payments, web, and analytics, all designed and
          built by one person. The fastest way to evaluate me is to download it.
        </p>
        <div className="cta-row">
          <a className="cta pri" href={`mailto:${EMAIL}`}>Email me</a>
          <a className="cta sec" href={APP_STORE} target="_blank" rel="noreferrer">iOS app</a>
          <a className="cta sec" href={GOOGLE_PLAY} target="_blank" rel="noreferrer">Android app</a>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat"><b>2,000</b><span>Registered athletes</span></div>
          <div className="stat"><b>210</b><span>Spots mapped</span></div>
          <div className="stat"><b>520</b><span>Workouts logged</span></div>
        </div>

        {/* WHAT I BUILT */}
        <h2>Every layer, built by me</h2>
        <p className="sub">
          CaliSpot maps the UK&apos;s outdoor calisthenics spots and builds community around the
          map — crews, events, workout logging, and social sharing. Live in three languages.
        </p>
        <div className="layers">
          {LAYERS.map(([k, v]) => (
            <div className="layer" key={k}><b>{k}</b><p>{v}</p></div>
          ))}
        </div>

        {/* PROOF */}
        <h2>Three problems I&apos;m proud of solving</h2>
        <p className="sub">The parts that separate a shipped product from a demo.</p>
        <div className="proofs">
          {PROOFS.map(([k, v]) => (
            <div className="proof" key={k}><h3>{k}</h3><p>{v}</p></div>
          ))}
        </div>

        {/* OFFER */}
        <h2>What I can do for you</h2>
        <p className="sub">Available for contract builds, fractional mobile engineering, and product engineering roles.</p>
        <div className="offers">
          {OFFERS.map(([k, v]) => (
            <div className="offer" key={k}><h3>{k}</h3><p>{v}</p></div>
          ))}
        </div>

        {/* CLOSE */}
        <div className="close">
          <p>
            <b>References and a full product walkthrough available on request.</b> Based in
            London, working with clients anywhere.
          </p>
          <a className="cta pri" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="flk">
          <Link href="/">Home</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="fcp">© {new Date().getFullYear()} CALISPOT LTD</div>
      </footer>
    </>
  );
}
