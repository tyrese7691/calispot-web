// Vibe Investment — concept redesign demo
// Live at calispot.xyz/vibeinvestments  ·  noindex, demo only.
// All copy, links and imagery are from the current vibeinvestment.com —
// same information, new presentation.

import { useEffect } from "react";
import Head from "next/head";

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";

// ── Their real assets (hot-linked from vibeinvestment.com) ──
const IMG = {
  logo: "https://vibeinvestment.com/wp-content/uploads/2025/07/logoT.png",
  hero: "https://vibeinvestment.com/wp-content/uploads/2025/09/25065685_2_0.jpg",
  prop1: "https://vibeinvestment.com/wp-content/uploads/2025/09/IMG_9752-scaled.jpg",
  prop2: "https://vibeinvestment.com/wp-content/uploads/2025/09/IMG_9181-scaled.jpeg",
  prop3: "https://vibeinvestment.com/wp-content/uploads/2025/09/IMG_3374.jpg",
  founder: "https://vibeinvestment.com/wp-content/uploads/2025/09/5j3a0052-edit-scaled.jpg",
  books: [
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/2.jpg", "https://amzn.to/3FLHfhH"],
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/1.jpg", "https://amzn.to/3ZUHOwr"],
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/3.jpg", "https://amzn.to/4dTFQCr"],
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/4.jpg", "https://amzn.to/4dPCsZf"],
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/5.jpg", "https://amzn.to/3SG7nO2"],
    ["https://vibeinvestment.com/wp-content/uploads/2025/07/6.jpg", "https://amzn.to/4jEDRD8"],
  ],
  pockets: "https://vibeinvestment.com/wp-content/uploads/2025/07/pocket.png",
};

const LINKS = {
  contact: "https://vibeinvestment.com/contact-us/",
  newsletter: "https://vibes-newsletter-cf2fde.beehiiv.com/",
  market: "https://goo.gl/maps/iaiuB8RxMtY7bKfeA",
  pockets: "https://www.biggerpockets.com/users/HardyV",
  facebook: "https://www.facebook.com/VibeInvestment/",
  instagram: "https://www.instagram.com/vibeinvestments/?hl=en",
  founder: "http://hardyvibert.com",
  phh: "http://www.phhhospitality.com",
  properties: {
    california: "https://vibeinvestment.com/california-ave/",
    eichelberger: "https://vibeinvestment.com/eichelberger-st/",
    aurora: "https://vibeinvestment.com/aurora-beam/",
  },
};

const FAQS = [
  ["How and when am I going to get my money back?",
   "This is where we always begin, as it's foundational to building confidence in our partnership. We proactively source and curate high-potential real estate opportunities, presenting them to our investor team for seamless execution. All investor funds are securely managed through a reputable third-party escrow service, ensuring transparency, compliance, and protection throughout the deal lifecycle. For our fix-and-flip projects, your capital is repatriated promptly upon project completion and successful sale of the property — we structure these deals with a defined timeline, typically targeting a 3–6 month hold period, after which proceeds (net of costs) are distributed directly to you, often including a targeted return. For whole rental acquisitions, we outline a robust exit strategy such as a future refinance or disposition, with projected timelines shared upfront. We're always prepared to walk through the specifics of any deal, including projected cash flow waterfalls and contingency plans."],
  ["What are the risks?",
   "We don't sugarcoat it — there are risks with any investment. The rental market could crash, tenants could stop paying rent, the flip may not sell right away, interest rates could rise, and more. We tell you clearly what the most likely downsides are and how probable they may be. Most important, we explain what we're doing to mitigate them — for example, our fix-and-flips are listed 5% below market price, and our rental projections include a vacancy rate. We've thought these through and have plans to work around them, and we'll show you exactly how."],
  ["How much of your own money are you putting in?",
   "If we're investing our own cash, we bring it up early — it cuts through concerns and shows our skin in the game. If we're not co-investing alongside you, we frame it as sweat equity: the value we bring through our expertise and effort. Even if we're borrowing from a bank with personal guarantees, that's a major commitment. We focus on the value of our involvement so you can see why we're all-in on the deal."],
  ["What if I need my money back?",
   "Real estate investments aren't liquid — it's tough to get cash back quickly. We educate upfront that you shouldn't fund deals with money you might need soon. You likely won't get your money back until the project wraps, unless we find someone to buy your position. If we sense this is your last dime without a safety net, we'll flag it — it's our duty to protect you."],
  ["How does this affect my income taxes?",
   "Earnings from our deals are taxable. You'll get a 1099 for interest on loans and a K-1 for partnerships. We have a top-notch CPA on our team to make this seamless — they'll even explain the process if needed, keeping things easy for you."],
  ["What are the logistics?",
   "Folks want the nitty-gritty on how funds flow, protections, and docs. If you have an IRA, we'll guide you through setup. New to lending? We explain mortgages and liens simply. For equity deals, we cover operating agreements and how they safeguard you. We ensure every I is dotted and T crossed — and if questions linger, we'll clarify until you're comfortable."],
];

export default function VibeRedesign() {
  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Vibe Investment — Multifamily Real Estate | Concept Redesign</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={FONTS} rel="stylesheet" />
      </Head>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --navy:#0B1F33;--navy2:#081827;--gold:#C9A24B;--gold2:#E3C57E;
          --paper:#F7F5F0;--ink:#182430;--soft:#5C6B7A;--line:rgba(11,31,51,.1);
          --serif:'Fraunces',serif;--sans:'Inter',sans-serif;
        }
        html{scroll-behavior:smooth}
        body{background:var(--paper);color:var(--ink);font-family:var(--sans)}
        a{text-decoration:none;color:inherit}

        /* ── Reveal system: each section gets its own motion ── */
        .rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
        .rv.left{transform:translateX(-44px)}
        .rv.right{transform:translateX(44px)}
        .rv.zoom{transform:scale(.94)}
        .rv.tilt{transform:translateY(30px) rotate(2.5deg)}
        .rv.in{opacity:1;transform:none}
        /* Curtain wipe (portfolio) */
        .rv.wipe{opacity:1;transform:none;clip-path:inset(0 100% 0 0);transition:clip-path .9s cubic-bezier(.7,0,.3,1)}
        .rv.wipe img{transform:scale(1.15);transition:transform 1.4s cubic-bezier(.2,.6,.2,1)}
        .rv.wipe.in{clip-path:inset(0 0 0 0)}
        .rv.wipe.in img{transform:scale(1)}
        /* Rising curtain (founder portrait) */
        .rv.unveil{opacity:1;transform:none;clip-path:inset(100% 0 0 0);transition:clip-path 1s cubic-bezier(.7,0,.3,1)}
        .rv.unveil.in{clip-path:inset(0 0 0 0)}
        /* Line-draw (vision steps: gold border grows in) */
        .step{position:relative;border-top:2px solid transparent}
        .step::before{content:'';position:absolute;top:-2px;left:0;height:2px;width:0;background:var(--gold);transition:width 1s cubic-bezier(.7,0,.3,1)}
        .step.in::before{width:100%}
        /* Staggers */
        .cards .card:nth-child(2){transition-delay:.1s}
        .cards .card:nth-child(3){transition-delay:.2s}
        .cards .card:nth-child(4){transition-delay:.3s}
        .props .prop:nth-child(2){transition-delay:.15s}
        .props .prop:nth-child(3){transition-delay:.3s}
        .steps .step:nth-child(2){transition-delay:.25s}
        .steps .step:nth-child(2)::before{transition-delay:.25s}
        .steps .step:nth-child(3){transition-delay:.5s}
        .steps .step:nth-child(3)::before{transition-delay:.5s}
        .shelf .book:nth-child(2n){transition-delay:.08s}
        .shelf .book:nth-child(3n){transition-delay:.16s}
        .stats-in .stat:nth-child(2){transition-delay:.1s}
        .stats-in .stat:nth-child(3){transition-delay:.2s}
        .stats-in .stat:nth-child(4){transition-delay:.3s}

        /* Nav */
        nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;
            padding:0 5vw;height:74px;background:rgba(11,31,51,.9);backdrop-filter:blur(14px)}
        .nlogo img{height:40px;display:block}
        .nlinks{display:flex;gap:2.2rem}
        .nlinks a{color:rgba(255,255,255,.75);font-size:.85rem;font-weight:500;letter-spacing:.04em;transition:color .2s}
        .nlinks a:hover{color:var(--gold2)}
        .ncta{background:var(--gold);color:var(--navy);font-weight:700;font-size:.8rem;letter-spacing:.06em;
              text-transform:uppercase;padding:.7rem 1.4rem;border-radius:3px;transition:background .2s}
        .ncta:hover{background:var(--gold2)}
        @media(max-width:820px){.nlinks{display:none}}

        /* Hero */
        .hero{position:relative;min-height:88vh;display:flex;align-items:center;background:var(--navy)}
        .hero::before{content:'';position:absolute;inset:0;background:url('${IMG.hero}') center/cover no-repeat;opacity:.28;
                      animation:kenburns 22s ease-in-out infinite alternate}
        @keyframes kenburns{from{transform:scale(1)}to{transform:scale(1.09)}}
        .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,rgba(8,24,39,.95) 30%,rgba(8,24,39,.4))}
        .hwrap{position:relative;z-index:2;padding:6rem 5vw;max-width:1200px;margin:0 auto;width:100%}
        .kicker{font-family:var(--sans);font-size:.72rem;font-weight:600;letter-spacing:.35em;text-transform:uppercase;
                color:var(--gold2);margin-bottom:1.6rem;animation:fadeUp .9s ease both}
        h1{font-family:var(--serif);font-weight:500;font-size:clamp(2.6rem,6vw,4.6rem);line-height:1.05;
           color:#fff;max-width:16ch;animation:fadeUp .9s .12s ease both}
        h1 em{font-style:italic;color:var(--gold2)}
        .hsub{margin-top:1.6rem;max-width:52ch;color:rgba(255,255,255,.66);font-size:1.05rem;line-height:1.75;
              animation:fadeUp .9s .24s ease both}
        .hbtns{display:flex;gap:1rem;margin-top:2.6rem;flex-wrap:wrap;animation:fadeUp .9s .36s ease both}
        .btn{display:inline-block;padding:1rem 2.2rem;border-radius:3px;font-weight:700;font-size:.82rem;
             letter-spacing:.08em;text-transform:uppercase;transition:all .25s}
        .btn.gold{background:var(--gold);color:var(--navy)}
        .btn.gold:hover{background:var(--gold2);transform:translateY(-2px)}
        .btn.ghost{border:1px solid rgba(255,255,255,.35);color:#fff}
        .btn.ghost:hover{border-color:var(--gold2);color:var(--gold2)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}

        /* Stats band */
        .stats{background:var(--navy2);padding:2.4rem 5vw}
        .stats-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem}
        .stat b{display:block;font-family:var(--serif);font-size:2rem;color:var(--gold2);font-weight:500}
        .stat span{font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5)}

        /* Sections */
        section{padding:6.5rem 5vw}
        .wrap{max-width:1200px;margin:0 auto}
        .eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
        h2{font-family:var(--serif);font-weight:500;font-size:clamp(1.9rem,3.6vw,2.8rem);line-height:1.15;max-width:20ch}
        .lead{color:var(--soft);line-height:1.85;font-size:1.02rem}

        .who{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start}
        @media(max-width:900px){.who{grid-template-columns:1fr}}
        .who .lead{margin-top:1.4rem}
        .dl{display:flex;align-items:center;gap:1rem;margin-top:2rem;padding:1.3rem 1.5rem;background:#fff;
            border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:4px;transition:transform .25s,box-shadow .25s}
        .dl:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(11,31,51,.1)}
        .dl b{font-size:.95rem}
        .dl span{display:block;font-size:.8rem;color:var(--soft);margin-top:2px}

        .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.2rem;margin-top:3rem}
        .card{background:#fff;border:1px solid var(--line);border-radius:6px;padding:2rem 1.7rem;transition:transform .25s,box-shadow .25s}
        .card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(11,31,51,.1)}
        .card .num{font-family:var(--serif);color:var(--gold);font-size:1rem;margin-bottom:1rem}
        .card h3{font-size:1.05rem;margin-bottom:.6rem}
        .card p{font-size:.9rem;color:var(--soft);line-height:1.7}

        /* Portfolio */
        .dark{background:var(--navy);color:#fff}
        .dark h2{color:#fff}
        .dark .lead{color:rgba(255,255,255,.6)}
        .props{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.4rem;margin-top:3rem}
        .prop{position:relative;border-radius:8px;overflow:hidden;height:360px;display:block}
        .prop img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
        .prop:hover img{transform:scale(1.06)}
        .prop .ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(8,24,39,.92));
                  display:flex;flex-direction:column;justify-content:flex-end;padding:1.6rem}
        .prop .city{font-size:.68rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:var(--gold2)}
        .prop h3{font-family:var(--serif);font-weight:500;font-size:1.5rem;margin-top:.4rem}
        .prop .view{margin-top:.6rem;font-size:.8rem;color:rgba(255,255,255,.65)}

        /* Vision timeline */
        .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.2rem;margin-top:3rem}
        .step{padding-top:1.4rem}
        .step .yr{font-family:var(--serif);font-size:1.6rem;color:var(--navy)}
        .step p{margin-top:.6rem;color:var(--soft);font-size:.95rem;line-height:1.7}

        /* Founder */
        .founder{display:grid;grid-template-columns:0.9fr 1.1fr;gap:4rem;align-items:center}
        @media(max-width:900px){.founder{grid-template-columns:1fr}}
        .fimg{border-radius:8px;overflow:hidden;box-shadow:24px 24px 0 rgba(201,162,75,.25)}
        .fimg img{width:100%;display:block}
        .flist{margin-top:1.6rem;display:grid;gap:.7rem}
        .flist li{list-style:none;padding-left:1.6rem;position:relative;color:var(--soft);font-size:.95rem;line-height:1.7}
        .flist li::before{content:'—';position:absolute;left:0;color:var(--gold)}

        /* FAQ */
        details{background:#fff;border:1px solid var(--line);border-radius:6px;margin-top:.8rem;overflow:hidden}
        summary{cursor:pointer;padding:1.3rem 1.6rem;font-weight:600;font-size:1rem;list-style:none;display:flex;justify-content:space-between;align-items:center}
        summary::-webkit-details-marker{display:none}
        summary::after{content:'+';font-family:var(--serif);font-size:1.4rem;color:var(--gold);transition:transform .3s}
        details[open] summary::after{transform:rotate(45deg)}
        details p{padding:0 1.6rem 1.5rem;color:var(--soft);line-height:1.85;font-size:.95rem}

        /* Books */
        .shelf{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1.2rem;margin-top:3rem}
        .book{border-radius:4px;overflow:hidden;transition:transform .25s;box-shadow:0 10px 30px rgba(11,31,51,.12)}
        .book:hover{transform:translateY(-6px)}
        .book img{width:100%;display:block}

        /* CTA band */
        .cta{background:linear-gradient(120deg,var(--navy),var(--navy2));text-align:center;color:#fff}
        .cta h2{margin:0 auto}
        .cta .lead{max-width:52ch;margin:1.4rem auto 0}

        footer{background:var(--navy2);color:rgba(255,255,255,.5);padding:3rem 5vw;font-size:.85rem}
        .fwrap{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.4rem}
        footer img{height:36px}
        .fsoc{display:flex;gap:1.4rem}
        .fsoc a{color:rgba(255,255,255,.6)}
        .fsoc a:hover{color:var(--gold2)}
        .demo-tag{position:fixed;bottom:14px;left:14px;z-index:200;background:var(--navy);color:var(--gold2);
                  font-size:.68rem;letter-spacing:.08em;padding:.5rem .9rem;border-radius:100px;opacity:.92}
      `}</style>

      <div className="demo-tag">CONCEPT REDESIGN — DEMO</div>

      {/* NAV */}
      <nav>
        <a href="#top" className="nlogo"><img src={IMG.logo} alt="Vibe Investment" /></a>
        <div className="nlinks">
          <a href="#who">About</a>
          <a href="#services">What We Do</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#vision">Vision</a>
          <a href="#faq">FAQ</a>
        </div>
        <a className="ncta" href={LINKS.contact} target="_blank" rel="noreferrer">Start Investing</a>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        <div className="hwrap">
          <div className="kicker">Multifamily Real Estate · St. Louis & Las Vegas</div>
          <h1>We guide investors into <em>profitable</em> investments.</h1>
          <p className="hsub">
            Founded in 2020, Vibe Investment specialises in long-term buy-and-hold
            real estate — helping new and seasoned investors build steady cash flow
            and lasting wealth through strategic acquisition, renovation and management.
          </p>
          <div className="hbtns">
            <a className="btn gold" href={LINKS.contact} target="_blank" rel="noreferrer">Looking to Invest</a>
            <a className="btn ghost" href="#portfolio">View Our Portfolio</a>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className="stats-in">
          <div className="stat rv"><b>2020</b><span>Founded</span></div>
          <div className="stat rv"><b>2</b><span>Markets — STL & LV</span></div>
          <div className="stat rv"><b>Buy & Hold</b><span>Core strategy</span></div>
          <div className="stat rv"><b>20–30</b><span>Unit portfolio target</span></div>
        </div>
      </div>

      {/* WHO WE ARE */}
      <section id="who">
        <div className="wrap who">
          <div className="rv left">
            <div className="eyebrow">Who We Are</div>
            <h2>Wealth, built the patient way.</h2>
            <a className="dl" href={LINKS.newsletter} target="_blank" rel="noreferrer">
              <div>
                <b>Free download: The Vibe Investment Difference</b>
                <span>How we help clients build real wealth →</span>
              </div>
            </a>
          </div>
          <div className="rv right">
            <p className="lead">
              Vibe Investment is a trusted real estate investment company specialising
              in long-term buy-and-hold strategies. We empower new and seasoned investors
              to build wealth through profitable real estate opportunities — whether
              you&apos;re struggling to start or seeking hassle-free investments, we guide
              you every step of the way.
            </p>
            <p className="lead" style={{ marginTop: "1rem" }}>
              Our services include finding the right properties, securing financing,
              managing investments, and providing expert education to ensure your
              success. With a focus on buy-and-hold, we help you generate steady cash
              flow and long-term value — with personalised support to help your
              portfolio grow.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">What We Do</div>
            <h2>Every step, handled.</h2>
          </div>
          <div className="cards">
            <div className="card rv"><div className="num">01</div><h3>Property Sourcing</h3><p>Finding the right properties — 4-plexes and small multifamily in stable, cash-flowing neighbourhoods.</p></div>
            <div className="card rv"><div className="num">02</div><h3>Financing</h3><p>Securing the right financing structure for each acquisition, aligned to your goals.</p></div>
            <div className="card rv"><div className="num">03</div><h3>Property Management</h3><p>Hands-on management — tenant relations, maintenance, leasing and compliance.</p></div>
            <div className="card rv"><div className="num">04</div><h3>Investor Education</h3><p>Expert education and personalised support, from first deal to full portfolio.</p></div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="dark" id="portfolio">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Our Portfolio</div>
            <h2>Two markets. One strategy.</h2>
            <p className="lead" style={{ marginTop: "1rem", maxWidth: "56ch" }}>
              Concentrated within 10 minutes of downtown St. Louis and in Las Vegas —
              stable, cash-flowing neighbourhoods, chosen with data and managed hands-on.
            </p>
          </div>
          <div className="props">
            <a className="prop rv wipe" href={LINKS.properties.california} target="_blank" rel="noreferrer">
              <img src={IMG.prop1} alt="California Ave" />
              <div className="ov"><span className="city">St. Louis, MO</span><h3>California Ave</h3><span className="view">View property →</span></div>
            </a>
            <a className="prop rv wipe" href={LINKS.properties.eichelberger} target="_blank" rel="noreferrer">
              <img src={IMG.prop2} alt="Eichelberger St" />
              <div className="ov"><span className="city">St. Louis, MO</span><h3>Eichelberger St</h3><span className="view">View property →</span></div>
            </a>
            <a className="prop rv wipe" href={LINKS.properties.aurora} target="_blank" rel="noreferrer">
              <img src={IMG.prop3} alt="Aurora Beam" />
              <div className="ov"><span className="city">Las Vegas, NV</span><h3>Aurora Beam</h3><span className="view">View property →</span></div>
            </a>
          </div>
          <p className="rv" style={{ marginTop: "2rem" }}>
            <a href={LINKS.market} target="_blank" rel="noreferrer" style={{ color: "#E3C57E", fontSize: ".9rem", fontWeight: 600 }}>
              View our market on the map →
            </a>
          </p>
        </div>
      </section>

      {/* VISION */}
      <section id="vision">
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Strategic Vision</div>
            <h2>A roadmap, not a guess.</h2>
          </div>
          <div className="steps">
            <div className="step rv"><div className="yr">Year 1</div><p>Acquire 4–6 multifamily units in St. Louis.</p></div>
            <div className="step rv"><div className="yr">Year 3</div><p>Build a portfolio of 20–30 units generating consistent returns.</p></div>
            <div className="step rv"><div className="yr">Year 5+</div><p>Scale into larger multifamily projects and syndications.</p></div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap founder">
          <div className="fimg rv unveil"><img src={IMG.founder} alt="Hardy Vibert, Founder" /></div>
          <div className="rv right">
            <div className="eyebrow">Our Founder</div>
            <h2>Hardy Vibert</h2>
            <p className="lead" style={{ marginTop: "1.2rem" }}>
              An entrepreneur with over a decade of experience in hospitality, real
              estate and property management. Hardy&apos;s expertise in building
              businesses — including founding and scaling{" "}
              <a href={LINKS.phh} target="_blank" rel="noreferrer" style={{ color: "#C9A24B", fontWeight: 600 }}>PHH Hospitality Group</a> —
              combined with his eye for value-add opportunities, drives Vibe
              Investments&apos; growth in multifamily real estate.
            </p>
            <ul className="flist">
              <li>Acquired and managed multifamily properties in the St. Louis market</li>
              <li>Skilled in deal sourcing, underwriting and closing multifamily acquisitions</li>
              <li>Proficient in analysing cash flows, ROI and long-term equity growth</li>
              <li>Built an extensive investor, wholesaler and property-manager network</li>
              <li>Hands-on management: tenant relations, maintenance, leasing, compliance</li>
            </ul>
            <p style={{ marginTop: "1.4rem" }}>
              <a href={LINKS.pockets} target="_blank" rel="noreferrer" style={{ color: "#C9A24B", fontWeight: 600, fontSize: ".9rem" }}>
                Find us on BiggerPockets →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="rv">
            <div className="eyebrow">Investor FAQ</div>
            <h2>Straight answers to the questions that matter.</h2>
            <p className="lead" style={{ marginTop: "1rem" }}>
              These are the questions we get all the time — answered transparently,
              because that&apos;s how trust is built.
            </p>
          </div>
          <div className="rv" style={{ marginTop: "2rem" }}>
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKS */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="rv">
            <div className="eyebrow">Books We Recommend</div>
            <h2>Read what we read.</h2>
          </div>
          <div className="shelf">
            {IMG.books.map(([img, link]) => (
              <a className="book rv tilt" key={img} href={link} target="_blank" rel="noreferrer">
                <img src={img} alt="Recommended book" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap rv zoom">
          <div className="eyebrow">Ready to Start?</div>
          <h2>Let&apos;s build your wealth, together.</h2>
          <p className="lead">
            At Vibe Investment, we bring the enthusiasm and expertise you need to
            thrive in real estate. Connect with us today.
          </p>
          <div className="hbtns" style={{ justifyContent: "center" }}>
            <a className="btn gold" href={LINKS.contact} target="_blank" rel="noreferrer">Contact Us</a>
            <a className="btn ghost" href={LINKS.newsletter} target="_blank" rel="noreferrer">Join the Newsletter</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="fwrap">
          <img src={IMG.logo} alt="Vibe Investment" />
          <div className="fsoc">
            <a href={LINKS.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <div>©2025 VIBE INVESTMENT LLC. All rights reserved. · Concept redesign by Tyrese Bewry</div>
        </div>
      </footer>
    </>
  );
}
