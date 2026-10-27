import Head from "next/head";
import Link from "next/link";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";
const APP_STORE = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.eightmind.calispot";

const STEPS = [
  {
    title: "Download and sign up",
    body: (
      <>
        CaliSpot is free on <a href={APP_STORE} target="_blank" rel="noreferrer">iPhone</a> and{" "}
        <a href={GOOGLE_PLAY} target="_blank" rel="noreferrer">Android</a>. Your account works on both,
        so you can switch phones without losing anything.
      </>
    ),
  },
  {
    title: "Allow location",
    body: <>CaliSpot uses your location to show the spots nearest to you. You can still browse the map without it.</>,
  },
  {
    title: "Find a spot",
    body: <>Open the map, or search for a park or area. Tap a spot to see photos, equipment and reviews from other users before you travel.</>,
  },
  {
    title: "Check in when you arrive",
    body: <>Checking in starts your session timer and lets others see the spot is active. When you finish, your session is saved to your profile.</>,
  },
  {
    title: "Find people to train with",
    body: <>Browse events for regular meetups at parks near you, join a crew, or add friends by scanning their QR code.</>,
  },
];

const FAQS = [
  {
    q: "Is CaliSpot free?",
    a: <>Yes. Finding spots, checking in, logging sessions, events and crews are all free. CaliSpot Pro is an optional subscription with extras like an AI workout generator, and it comes with a 7-day free trial.</>,
  },
  {
    q: "I can't see any spots near me. What can I do?",
    a: <>First, check location is turned on for CaliSpot in your phone&apos;s settings. Coverage is strongest in London and the UK, and it grows because users add spots. If your local park is missing, add it yourself and it&apos;ll appear for everyone once it&apos;s checked.</>,
  },
  {
    q: "How do I add a new spot?",
    a: <>Use the option to submit a spot, then add its location, a photo and the equipment there. Good photos help other people decide whether it&apos;s worth the trip.</>,
  },
  {
    q: "What are XP and leagues?",
    a: <>You earn XP when you check in and train. Your monthly XP puts you in a league with other users, so there&apos;s a bit of friendly competition to keep you consistent.</>,
  },
  {
    q: "I'm not getting notifications.",
    a: <>Check notifications are allowed for CaliSpot in your phone&apos;s settings. If you&apos;ve just reinstalled the app or switched phones, open CaliSpot once so it can reconnect. If they still don&apos;t arrive, email us and we&apos;ll look into it.</>,
  },
  {
    q: "Can I use the same account on iPhone and Android?",
    a: <>Yes. Log in with the same account and your spots, sessions, friends and XP come with you.</>,
  },
  {
    q: "How do I delete my account?",
    a: <>In the app, go to <strong>Profile</strong>, tap <strong>Settings</strong>, then <strong>Delete Account</strong>. If you&apos;ve uninstalled the app, see <Link href="/delete-account">how to delete your account</Link>.</>,
  },
];

export default function GettingStarted() {
  return (
    <>
      <Head>
        <title>Getting Started — CaliSpot</title>
        <meta name="description" content="New to CaliSpot? How to find outdoor calisthenics spots, check in, and meet people to train with, plus answers to common questions." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/calilogobg.png" />
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
        .lead{font-size:1.1rem;line-height:1.6;color:var(--wm);margin-bottom:40px;max-width:60ch}
        h2{font-size:1.5rem;font-weight:800;letter-spacing:-.015em;margin:44px 0 16px;color:var(--w)}
        p{font-size:1rem;line-height:1.65;color:var(--w);margin-bottom:14px}
        strong{font-weight:700;color:var(--w)}
        a{color:var(--g);text-decoration:underline;text-underline-offset:3px}
        a:hover{color:var(--y)}
        .divider{height:1px;background:var(--bd);margin:28px 0}

        .steps{list-style:none;counter-reset:step}
        .step{counter-increment:step;display:flex;gap:18px;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px 22px;margin:12px 0}
        .step::before{content:counter(step);flex-shrink:0;width:34px;height:34px;border-radius:50%;background:var(--y);color:#0d0d0d;font-weight:900;display:grid;place-items:center;font-size:.95rem}
        .step h3{font-size:1.05rem;font-weight:700;color:var(--y);margin-bottom:4px;font-family:var(--font)}
        .step p{margin:0;line-height:1.6}

        .faq details{background:var(--card);border:1px solid var(--bd);border-radius:16px;margin:10px 0;transition:border-color .2s}
        .faq details[open]{border-color:rgba(245,200,66,.35)}
        .faq summary{cursor:pointer;list-style:none;padding:18px 22px;font-weight:700;font-size:1rem;display:flex;justify-content:space-between;gap:16px;align-items:center}
        .faq summary::-webkit-details-marker{display:none}
        .faq summary::after{content:"+";color:var(--y);font-size:1.4rem;font-weight:400;line-height:1}
        .faq details[open] summary::after{content:"–"}
        .faq details p{padding:0 22px 18px;margin:0;color:rgba(255,255,255,.75)}

        .help{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:26px;margin-top:16px}
        .help p:last-child{margin-bottom:0}

        .back-wrap{margin-top:60px}
        .back-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:var(--card);border:1px solid var(--bd);color:var(--w);font-weight:700;font-size:.9rem;text-decoration:none;transition:border-color .2s ease}
        .back-btn:hover{border-color:var(--y);color:var(--y)}

        /* FOOTER — matches privacy.js */
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
          .step{padding:18px;gap:14px}
          footer{padding-left:24px;padding-right:24px}
        }
      `}</style>

      <nav>
        <Link href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
        </Link>
        <a href={APP_STORE} target="_blank" rel="noreferrer" className="nbtn">Download on iOS</a>
      </nav>

      <div className="wrap">
        <h1>Getting <span className="accent">started</span></h1>
        <p className="lead">Find a spot, train, and meet people to train with. Here&apos;s everything you need for your first session, plus answers to the questions we get asked most.</p>

        <h2>Your first 5 minutes</h2>
        <ol className="steps">
          {STEPS.map((s) => (
            <li className="step" key={s.title}>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2>Common questions</h2>
        <div className="faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2>Still stuck?</h2>
        <div className="help">
          <p>
            Email <a href="mailto:support@calispot.xyz">support@calispot.xyz</a> with what you were trying
            to do and, if you can, a screenshot. Every message gets a personal reply.
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

      <footer>
        <div className="flk">
          <Link href="/getting-started">Getting Started</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/delete-account">Delete Account</Link>
          <a href="mailto:support@calispot.xyz">Contact</a>
          <a href={APP_STORE} target="_blank" rel="noreferrer">App Store</a>
          <a href={GOOGLE_PLAY} target="_blank" rel="noreferrer">Google Play</a>
          <a href="https://www.instagram.com/calispot.xyz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="fcp">&copy; 2026 Tyrese Bewry &middot; CALISPOT LTD</div>
      </footer>
    </>
  );
}
