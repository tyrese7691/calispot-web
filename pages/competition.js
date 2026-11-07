import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";
const APP_STORE = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.eightmind.calispot";
const INSTAGRAM = "https://www.instagram.com/calispot.xyz/";

// 24 Dec 2026, 23:59 GMT
const DEADLINE = Date.UTC(2026, 11, 24, 23, 59, 0);

const STEPS = [
  {
    title: "Film your attempt",
    body: <>One continuous take, no cuts. Phone propped against a bag works fine — just make sure your whole body and the bar are in frame.</>,
  },
  {
    title: "Start with the intro",
    body: <>Say <em>&ldquo;This is my entry for the CaliSpot competition&rdquo;</em>, name your category and the spot you&apos;re at. Then straight into your attempt, same take, no cut.</>,
  },
  {
    title: "Post it as a Reel",
    body: <>On a public Instagram account, so we can actually see it.</>,
  },
  {
    title: "Follow @calispot.xyz",
    body: <>And tag us plus Gornation in the post.</>,
  },
  {
    title: "Use #CaliSpotChristmas",
    body: <>So your entry shows up alongside everyone else&apos;s.</>,
  },
  {
    title: "Best Skill only — send it to us",
    body: <>DM the video file to <a href={INSTAGRAM} target="_blank" rel="noreferrer">@calispot.xyz</a>. We post it on our page and tag you, and the likes on <strong>our</strong> post decide the winner. Max Reps entries don&apos;t need sending.</>,
  },
];

const RULES = [
  "Free to enter and open to everyone, anywhere Gornation delivers. If you're under 18, check with a parent or guardian first.",
  "Entries must be public Instagram Reels posted between 24 November and 23:59 GMT on 24 December 2026, following and tagging @calispot.xyz, tagging Gornation, and using #CaliSpotChristmas.",
  "Best Skill entries must also be DM'd to @calispot.xyz so we can post them on the CaliSpot page. Entries not sent to us can't be voted on and aren't eligible. Max Reps entries don't need sending.",
  "One continuous take with the spoken intro included. No cuts, no edits to the attempt, no speeding up.",
  "Unlimited entries across both categories.",
  "Enter the division you identify with.",
  "Max Reps is decided by the judges. Best Skill is decided by the number of likes on the CaliSpot page's post of your entry at 23:59 GMT on 24 December. Judges' decisions are final.",
  "By entering you're giving CaliSpot and Gornation permission to repost your video and handle on their channels and website.",
  "Anything misrepresented, edited, or not filmed by you gets disqualified. So are bought likes, engagement pods, or any obvious attempt to game the vote.",
  "Winners announced on @calispot.xyz on 26 December 2026 and contacted by DM. No response within 7 days and the prize goes to the runner-up.",
  "This promotion is in no way sponsored, endorsed, administered by, or associated with Instagram.",
];

function useCountdown() {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, DEADLINE - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
    over: left === 0,
  };
}

export default function Competition() {
  const c = useCountdown();

  return (
    <>
      <Head>
        <title>Christmas Competition — CaliSpot × Gornation</title>
        <meta name="description" content="£200 in Gornation vouchers across four categories. Max reps and best skill, men's and women's. Enter by 24 December 2026." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/calilogobg.png" />
        <meta property="og:title" content="CaliSpot × Gornation Christmas Competition" />
        <meta property="og:description" content="£200 in Gornation vouchers. Four winners. Film your set, post it, tag us. Closes Christmas Eve." />
        <meta property="og:type" content="website" />
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

        .wrap{max-width:860px;margin:0 auto;padding:72px 32px 120px}
        .eyebrow{font-family:var(--mono);font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:16px}
        h1{font-size:clamp(2.5rem,6.5vw,4.2rem);font-weight:900;letter-spacing:-.035em;line-height:1;margin-bottom:20px}
        h1 .accent{color:var(--y)}
        .lead{font-size:1.15rem;line-height:1.6;color:var(--wm);margin-bottom:36px;max-width:56ch}
        h2{font-size:1.55rem;font-weight:800;letter-spacing:-.015em;margin:56px 0 18px}
        h3{font-size:1.05rem;font-weight:700;color:var(--y);margin-bottom:6px}
        p{font-size:1rem;line-height:1.65;margin-bottom:14px}
        strong{font-weight:700;color:#fff}
        a{color:var(--g);text-decoration:underline;text-underline-offset:3px}
        a:hover{color:var(--y)}

        /* countdown */
        .cd{display:flex;gap:10px;margin:0 0 36px;flex-wrap:wrap}
        .cd-box{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 0;min-width:84px;flex:1;text-align:center}
        .cd-n{font-size:1.9rem;font-weight:900;color:var(--y);line-height:1;font-variant-numeric:tabular-nums}
        .cd-l{font-family:var(--mono);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--wm);margin-top:6px}
        .cd-closed{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;text-align:center;margin-bottom:36px;color:var(--wm)}

        .ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:999px;font-weight:800;font-size:.92rem;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .btn-p{background:var(--y);color:#0d0d0d}
        .btn-p:hover{transform:scale(1.04);box-shadow:0 0 28px rgba(245,200,66,.45);color:#0d0d0d}
        .btn-s{background:var(--card);border:1px solid var(--bd);color:var(--w)}
        .btn-s:hover{border-color:var(--y);color:var(--y)}

        /* category cards */
        .cats{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px}
        .cat{background:var(--card);border:1px solid var(--bd);border-radius:18px;padding:24px}
        .cat-tag{font-family:var(--mono);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--y);margin-bottom:10px}
        .cat h3{font-size:1.3rem;margin-bottom:10px;color:#fff}
        .cat p{font-size:.95rem;color:rgba(255,255,255,.72);margin-bottom:10px}
        .cat .how{font-size:.85rem;color:var(--wm);border-top:1px solid var(--bd);padding-top:12px;margin:0}
        .cat .how b{color:var(--y);font-weight:700}

        .prizes{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 0}
        .prize{flex:1;min-width:150px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:16px 18px}
        .prize b{display:block;color:var(--y);font-size:1.4rem;font-weight:900;line-height:1}
        .prize span{font-size:.82rem;color:var(--wm);display:block;margin-top:6px}

        .steps{list-style:none;counter-reset:step}
        .step{counter-increment:step;display:flex;gap:18px;background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:20px 22px;margin:12px 0}
        .step::before{content:counter(step);flex-shrink:0;width:34px;height:34px;border-radius:50%;background:var(--y);color:#0d0d0d;font-weight:900;display:grid;place-items:center;font-size:.95rem}
        .step p{margin:0;line-height:1.6;font-size:.96rem;color:rgba(255,255,255,.78)}

        .callout{background:linear-gradient(180deg,rgba(245,200,66,.12),rgba(245,200,66,.04));border:1px solid rgba(245,200,66,.3);border-radius:18px;padding:24px 26px;margin:18px 0}
        .callout p:last-child{margin-bottom:0}
        .quote{font-size:1.1rem;font-weight:700;color:var(--y);line-height:1.5;margin-bottom:10px}

        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px}
        .form-card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:22px}
        .form-card p{font-size:.94rem;color:rgba(255,255,255,.75);margin:0}
        .nope{margin-top:16px;font-size:.92rem;color:var(--wm)}
        .nope b{color:rgba(255,255,255,.8)}

        .rules{counter-reset:rule;list-style:none;margin-top:8px}
        .rules li{counter-increment:rule;position:relative;padding:11px 0 11px 40px;border-bottom:1px solid var(--bd);font-size:.93rem;line-height:1.6;color:rgba(255,255,255,.74)}
        .rules li::before{content:counter(rule);position:absolute;left:0;top:11px;font-family:var(--mono);font-size:.72rem;color:var(--y)}
        .rules li:last-child{border-bottom:none}

        .dates{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
        .date{flex:1;min-width:170px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px}
        .date b{display:block;font-size:1rem;color:#fff;margin-bottom:4px}
        .date span{font-size:.84rem;color:var(--wm)}

        .back-wrap{margin-top:64px}
        .back-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:999px;background:var(--card);border:1px solid var(--bd);color:var(--w);font-weight:700;font-size:.9rem;text-decoration:none;transition:border-color .2s}
        .back-btn:hover{border-color:var(--y);color:var(--y)}

        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .flk{display:flex;gap:2rem;flex-wrap:wrap}
        .flk a{font-family:var(--mono);font-size:.63rem;color:rgba(255,255,255,.2);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .flk a:hover{color:var(--wm)}
        .fcp{font-family:var(--mono);font-size:.56rem;color:rgba(255,255,255,.1)}

        @media (max-width:700px){
          nav{padding:0 24px;height:60px}
          .nl-logo{width:40px;height:40px}
          .wrap{padding:46px 22px 80px}
          h2{font-size:1.3rem;margin-top:44px}
          .cats,.form-grid{grid-template-columns:1fr}
          .cd-box{min-width:0;padding:12px 0}
          .cd-n{font-size:1.5rem}
          .btn{width:100%;justify-content:center}
          footer{padding-left:24px;padding-right:24px}
        }
      `}</style>

      <nav>
        <Link href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
        </Link>
        <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="nbtn">Enter on Instagram</a>
      </nav>

      <div className="wrap">
        <div className="eyebrow">CaliSpot × Gornation</div>
        <h1>£200 in vouchers.<br /><span className="accent">Four winners.</span></h1>
        <p className="lead">
          Film a set. Post it. That&apos;s the whole competition. Four £50 Gornation
          vouchers going before Christmas — max reps and best skill, men&apos;s and women&apos;s.
        </p>

        {c && !c.over && (
          <div className="cd">
            <div className="cd-box"><div className="cd-n">{c.days}</div><div className="cd-l">Days</div></div>
            <div className="cd-box"><div className="cd-n">{c.hours}</div><div className="cd-l">Hours</div></div>
            <div className="cd-box"><div className="cd-n">{c.mins}</div><div className="cd-l">Mins</div></div>
            <div className="cd-box"><div className="cd-n">{c.secs}</div><div className="cd-l">Secs</div></div>
          </div>
        )}
        {c && c.over && (
          <div className="cd-closed">Entries are closed. Winners announced on <a href={INSTAGRAM} target="_blank" rel="noreferrer">@calispot.xyz</a>.</div>
        )}

        <div className="ctas">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-p">Enter on Instagram</a>
          <a href="#how" className="btn btn-s">How it works</a>
        </div>

        <h2>The categories</h2>
        <div className="cats">
          <div className="cat">
            <div className="cat-tag">Men&apos;s &amp; Women&apos;s</div>
            <h3>Max Reps on the Bars</h3>
            <p>Pull-ups or dips. One continuous set, as many as you can hold on for.</p>
            <p className="how"><b>Judged.</b> On the most impressive effort overall — the movement, the number, and the quality of your form. Likes count for nothing, so you don&apos;t need a following to win it.</p>
          </div>
          <div className="cat">
            <div className="cat-tag">Men&apos;s &amp; Women&apos;s</div>
            <h3>Best Skill</h3>
            <p>Any skill you&apos;ve got. Front lever, planche, one-arm work, muscle-ups — or string a freestyle together and show the lot.</p>
            <p className="how"><b>Voted.</b> We post every entry on our page and the one with the most likes on Christmas Eve wins. Same page, same audience — so it&apos;s about who gets their people out, not who turned up with the biggest following.</p>
          </div>
        </div>

        <div className="prizes">
          <div className="prize"><b>£50</b><span>Max Reps — Men&apos;s</span></div>
          <div className="prize"><b>£50</b><span>Max Reps — Women&apos;s</span></div>
          <div className="prize"><b>£50</b><span>Best Skill — Men&apos;s</span></div>
          <div className="prize"><b>£50</b><span>Best Skill — Women&apos;s</span></div>
        </div>

        <h2 id="how">How to enter</h2>
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
        <p style={{ marginTop: 18, color: "rgba(255,255,255,.6)" }}>
          <strong>Enter as many times as you like.</strong> Another skill, a better rep count,
          three skills combined into one run — every entry counts separately.
        </p>

        <h2>The intro</h2>
        <div className="callout">
          <p className="quote">&ldquo;This is my entry for the CaliSpot competition, Best Skill, and I&apos;m at Paddington Rec.&rdquo;</p>
          <p>Every entry opens with a line like that, spoken out loud, in the same unbroken take as the attempt. No cut between the intro and the set.</p>
          <p>It keeps everything honest — no old footage, no reposts — and it tells people where you train, which is rather the point of CaliSpot.</p>
        </div>

        <h2>Max Reps — what counts</h2>
        <div className="form-grid">
          <div className="form-card">
            <h3>Pull-ups</h3>
            <p>Any grip: overhand, underhand, neutral, wide, or chest-to-bar. Every rep starts from a full dead hang with straight arms and finishes with your chin clearly over the bar. No kipping, no swinging, no leg drive.</p>
          </div>
          <div className="form-card">
            <h3>Dips</h3>
            <p>Parallel bars or straight bar. Every rep starts with your arms locked out at the top and lowers until your shoulders are at least level with your elbows.</p>
          </div>
        </div>
        <p className="nope">
          <b>Both:</b> one continuous set — come off the bar and your set is over.{" "}
          <b>Not eligible:</b> Australian pull-ups and inverted rows, bench dips, feet-on-floor
          or band-assisted reps, jumping or kipping reps, and partial range.
        </p>

        <h2>Key dates</h2>
        <div className="dates">
          <div className="date"><b>Tue 24 November</b><span>Entries open</span></div>
          <div className="date"><b>Thu 24 December, 23:59</b><span>Entries close · likes counted</span></div>
          <div className="date"><b>Sat 26 December</b><span>Winners announced</span></div>
        </div>

        <h2>Full rules</h2>
        <ol className="rules">
          {RULES.map((r, i) => <li key={i}>{r}</li>)}
        </ol>

        <h2>Ready?</h2>
        <p style={{ color: "rgba(255,255,255,.7)", maxWidth: "52ch" }}>
          Find a spot near you in the app, film your set, and tag us. Questions go to{" "}
          <a href="mailto:support@calispot.xyz">support@calispot.xyz</a>.
        </p>
        <div className="ctas" style={{ marginTop: 18 }}>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-p">Enter on Instagram</a>
          <a href={APP_STORE} target="_blank" rel="noreferrer" className="btn btn-s">Get the app</a>
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
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="fcp">&copy; 2026 Tyrese Bewry &middot; CALISPOT LTD</div>
      </footer>
    </>
  );
}
