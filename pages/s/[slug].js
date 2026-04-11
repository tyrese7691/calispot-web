// pages/s/[slug].js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";



const APP_STORE    = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const SUPABASE_URL = "https://nrfwyewylurdmsnxycwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnd5ZXd5bHVyZG1zbnh5Y3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc4MTIsImV4cCI6MjA4NzA5MzgxMn0.QJCdBm0Fa3xX1TsOJ5bLEodKpcgGjniz8vEM-_RA8wc";
const IMG_BASE  = "https://pub-179dbc4e92bd4ba0b4adc0b1cc3137f0.r2.dev/";
const FONTS     = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

const EQ_LABELS = {
  abs:        "Abs Station",
  dipBars:    "Dip Bars",
  lowBars:    "Low Bars",
  monkeyBars: "Monkey Bars",
  pullUpBars: "Pull-Up Bars",
};
const EQ_ICONS = {
  abs:        "/images/absyes.png",
  dipBars:    "/images/dipyes.png",
  lowBars:    "/images/lowbaryes.png",
  monkeyBars: "/images/monkeybarsyes.png",
  pullUpBars: "/images/pullupyes.png",
};

function Dots({ val, max = 5 }) {
  return (
    <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:10 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: i < val ? 10 : 6, height: i < val ? 10 : 6,
          borderRadius:"50%", alignSelf:"center",
          background: i < val ? "#F5C842" : "rgba(255,255,255,0.12)",
          transition:"all .3s",
        }} />
      ))}
    </div>
  );
}

export default function SpotPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [spot, setSpot]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [activeImg, setActiveImg]   = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [events, setEvents]         = useState([]);
  const [heroIdx, setHeroIdx]       = useState(0);
  const heroTimer                   = useRef(null);



  useEffect(() => {
    if (!slug) return;
    fetch("https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/spots/spots.json", { cache:"no-store" })
      .then(r => r.json())
      .then(data => {
        const found = data.find(s => s.slug === slug);
        found ? setSpot(found) : setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!spot?.images?.length) return;
    heroTimer.current = setInterval(() => setHeroIdx(p => (p + 1) % spot.images.length), 4000);
    return () => clearInterval(heroTimer.current);
  }, [spot]);

  // Fetch upcoming events for this spot from Supabase
  useEffect(() => {
    if (!slug) return;
    const now = new Date().toISOString();
    fetch(
      `${SUPABASE_URL}/rest/v1/events?spot_slug=eq.${slug}&event_date=gte.${now}&order=event_date.asc&limit=5&select=id,title,event_date,location_name,is_free,price,join_url,organiser_name`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setEvents(data) : setEvents([]))
      .catch(() => setEvents([]));
  }, [slug]);

  // Attempt to open in app silently — iframe method fails quietly if app not installed
  // avoids Safari "address is invalid" error that window.location.href causes
  useEffect(() => {
    if (!slug) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `calispot://s/${slug}`;
    document.body.appendChild(iframe);
    const t = setTimeout(() => {
      try { document.body.removeChild(iframe); } catch {}
    }, 1000);
    return () => {
      clearTimeout(t);
      try { document.body.removeChild(iframe); } catch {}
    };
  }, [slug]);

  const onTouchStart = e => setTouchStart(e.touches[0].clientX);
  const onTouchEnd   = e => {
    if (!touchStart || !spot) return;
    const d = touchStart - e.changedTouches[0].clientX;
    if (d >  50) setActiveImg(p => (p === spot.images.length - 1 ? 0 : p + 1));
    if (d < -50) setActiveImg(p => (p === 0 ? spot.images.length - 1 : p - 1));
    setTouchStart(null);
  };



  const title   = spot ? `${spot.name} — CaliSpot` : "CaliSpot";
  const desc    = spot ? `Outdoor calisthenics spot. Equipment, photos and directions - free on CaliSpot.` : "Find outdoor calisthenics spots near you.";
  const ogImage = spot?.images?.[0] ? `${IMG_BASE}${spot.images[0]}` : "/images/calilogobg.png";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-itunes-app" content={`app-id=6747050360, app-argument=calispot://s/${slug||""}`} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image"       content={ogImage} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={`https://www.calispot.xyz/s/${slug||""}`} />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={title} />
        <meta name="twitter:image"      content={ogImage} />
        <link rel="icon" href="/images/calilogobg.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={FONTS} rel="stylesheet" />

      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --y:#F5C842;--g:#3DFF8F;--bg:#0a0a0a;--bg2:#111;
          --bd:rgba(255,255,255,.07);--w:rgba(255,255,255,.92);--wm:rgba(255,255,255,.4);
          --font:'Bricolage Grotesque',sans-serif;--mono:'DM Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:var(--font);overflow-x:hidden;min-height:100vh}

        .nav{position:sticky;top:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;background:rgba(10,10,10,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--bd)}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nav-logo img{width:51px;height:51px;border-radius:50%}
        .nav-logo span{font-size:2rem;font-weight:800;color:var(--w)}
        .nav-dl{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#000;font-size:.7rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase;padding:.55rem 1.3rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nav-dl:hover{transform:scale(1.04);box-shadow:0 0 24px rgba(245,200,66,.45)}

        .hero{position:relative;height:70vh;min-height:420px;overflow:hidden;display:flex;align-items:flex-end}
        .hero-bg{position:absolute;inset:0;background:#111}
        .hero-bg img{width:100%;height:100%;object-fit:cover;display:block;opacity:.7;animation:fadeIn .6s ease}
        .hero-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,0) 0%,rgba(10,10,10,.2) 40%,rgba(10,10,10,.85) 80%,rgba(10,10,10,1) 100%)}
        .hero-content{position:relative;z-index:2;width:100%;padding:0 40px 40px;display:flex;flex-direction:column;gap:12px}
        .hero-tag{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--y);background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.2);padding:4px 10px;border-radius:50px;width:fit-content}
        .hero-dot{width:6px;height:6px;border-radius:50%;background:var(--y);animation:pulse 2s infinite}
        .hero-title{font-size:clamp(2.4rem,7vw,5.5rem);font-weight:900;line-height:.92;letter-spacing:-.03em;color:#fff}
        .hero-meta{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
        .hero-meta-item{font-family:var(--mono);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--wm);display:flex;align-items:center;gap:6px}
        .hero-meta-item::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--wm)}
        .hero-dots{display:flex;gap:6px;align-items:center;margin-left:auto}
        .hero-dot-btn{height:6px;border-radius:3px;border:none;cursor:pointer;padding:0;transition:all .3s;background:rgba(255,255,255,.3)}

        .app-bar{margin:24px 40px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,200,66,.06);border:1px solid rgba(245,200,66,.15);border-radius:18px;padding:14px 20px}
        .app-bar-l{display:flex;align-items:center;gap:12px}
        .app-bar-icon{width:42px;height:42px;border-radius:10px;overflow:hidden;flex-shrink:0}
        .app-bar-icon img{width:100%;height:100%;object-fit:cover}
        .app-bar-name{font-size:.88rem;font-weight:700;color:#fff}
        .app-bar-sub{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);margin-top:2px}
        .app-bar-btn{flex-shrink:0;background:var(--y);color:#000;font-size:.7rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:.6rem 1.3rem;border-radius:50px;text-decoration:none;transition:transform .2s;white-space:nowrap}
        .app-bar-btn:hover{transform:scale(1.04)}

        .body{max-width:860px;margin:0 auto;padding:0 40px 100px}
        .sec-label{font-family:var(--mono);font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:var(--wm);display:flex;align-items:center;gap:10px;margin-bottom:16px}
        .sec-label::before{content:'';width:20px;height:1px;background:var(--wm)}

        .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px}
        .stat-card{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:24px 20px;text-align:center;transition:border-color .3s,transform .3s}
        .stat-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-2px)}
        .stat-num{font-size:3.2rem;font-weight:900;letter-spacing:-.04em;color:var(--y);line-height:1}
        .stat-denom{font-size:1.2rem;color:rgba(255,255,255,.2)}
        .stat-name{font-family:var(--mono);font-size:.55rem;letter-spacing:.16em;text-transform:uppercase;color:var(--wm);margin-top:8px}

        .equip-grid{display:flex;flex-direction:row;flex-wrap:nowrap;gap:10px;margin-bottom:32px;overflow-x:auto;scrollbar-width:none;padding:8px 4px 12px}
        .equip-grid::-webkit-scrollbar{display:none}
        .equip-card{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:20px 12px;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color .3s,transform .3s}
        .equip-card:hover{border-color:rgba(61,255,143,.25);transform:translateY(-2px)}
        .equip-card img{width:96px;height:96px;object-fit:contain}
        .equip-card span{font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;color:var(--wm);text-align:center;line-height:1.4}

        .station{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:14px;margin-bottom:32px;transition:border-color .3s}
        .station:hover{border-color:rgba(255,255,255,.15)}
        .station img{width:96px;height:96px;object-fit:contain;flex-shrink:0}
        .station-lbl{font-family:var(--mono);font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:var(--wm)}
        .station-name{font-size:1rem;font-weight:700;color:#fff;margin-top:3px}

        .photo-strip{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:8px 4px 12px;margin-bottom:32px;scrollbar-width:none}
        .photo-strip::-webkit-scrollbar{display:none}
        .photo-thumb{scroll-snap-align:start;flex-shrink:0;width:240px;height:170px;border-radius:14px;overflow:hidden;border:1px solid var(--bd);cursor:pointer;transition:transform .3s,border-color .3s;overflow:visible}
        .photo-thumb:hover{transform:translateY(-6px) scale(1.03);border-color:rgba(245,200,66,.3)}
        .photo-thumb img{width:100%;height:100%;object-fit:cover;display:block;border-radius:14px}

        .map-wrap{border-radius:20px;overflow:hidden;height:280px;border:1px solid var(--bd);margin-bottom:48px}

        .cta{position:relative;overflow:hidden;background:var(--y);border-radius:28px;padding:56px 40px;text-align:center}
        .cta-eyb{font-family:var(--mono);font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(0,0,0,.45);margin-bottom:12px;position:relative}
        .cta h2{font-size:clamp(2.4rem,7vw,5rem);font-weight:900;letter-spacing:-.04em;line-height:.9;color:#0a0a0a;margin-bottom:14px;position:relative}
        .cta p{font-size:.9rem;color:rgba(0,0,0,.5);margin-bottom:28px;position:relative;max-width:320px;margin-left:auto;margin-right:auto}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#0a0a0a;color:var(--y);font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:1rem 2.2rem;border-radius:50px;text-decoration:none;position:relative;transition:transform .2s,box-shadow .2s}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,.25)}
        .cta-sub{margin-top:14px;font-family:var(--mono);font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.35);position:relative}

        footer{border-top:1px solid var(--bd);padding:28px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .f-links{display:flex;gap:24px;flex-wrap:wrap}
        .f-links a{font-family:var(--mono);font-size:.58rem;letter-spacing:.1em;color:rgba(255,255,255,.18);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .f-links a:hover{color:var(--wm)}
        .f-copy{font-family:var(--mono);font-size:.52rem;color:rgba(255,255,255,.1)}

        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out}
        .overlay img{max-width:92%;max-height:78vh;border-radius:14px;object-fit:contain}
        .overlay-arrow{position:absolute;top:50%;transform:translateY(-50%);font-size:2.8rem;color:rgba(255,255,255,.6);background:none;border:none;cursor:pointer;padding:0 20px;user-select:none;transition:color .2s}
        .overlay-arrow:hover{color:#fff}
        .overlay-close{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:10000}
        .overlay-close:hover{background:rgba(255,255,255,.2)}

        .state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:14px;text-align:center;padding:40px}
        .state-icon{font-size:3rem}
        .state-title{font-size:1.5rem;font-weight:800;color:#fff}
        .state-sub{font-size:.9rem;color:var(--wm)}

        /* PT card */
        .pt-card{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;overflow:hidden;margin-bottom:32px;transition:border-color .3s}
        .pt-card:hover{border-color:rgba(245,200,66,.3)}
        .pt-header{background:var(--y);padding:8px 16px;display:flex;align-items:center;gap:6px}
        .pt-header-text{font-family:var(--mono);font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#000}
        .pt-body{padding:20px;display:flex;align-items:flex-start;gap:16px}
        .pt-avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--bd)}
        .pt-info{flex:1;min-width:0}
        .pt-name{font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:4px}
        .pt-bio{font-size:.82rem;color:var(--wm);line-height:1.5;margin-bottom:12px}
        .pt-links{display:flex;gap:8px;flex-wrap:wrap}
        .pt-link{display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:#000;background:var(--y);padding:.4rem .9rem;border-radius:50px;text-decoration:none;font-weight:700;transition:transform .2s}
        .pt-link:hover{transform:scale(1.04)}
        /* Event cards */
        .event-list{display:flex;flex-direction:column;gap:10px;margin-bottom:32px}
        .event-card{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:16px;transition:border-color .3s,transform .3s;text-decoration:none}
        .event-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-2px)}
        .event-date-box{background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.15);border-radius:12px;padding:8px 12px;text-align:center;flex-shrink:0;min-width:52px}
        .event-date-day{font-size:1.4rem;font-weight:900;color:var(--y);line-height:1}
        .event-date-mon{font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;color:var(--wm);margin-top:2px}
        .event-info{flex:1;min-width:0}
        .event-title{font-size:.95rem;font-weight:700;color:#fff;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .event-meta{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm)}
        .event-badge{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .7rem;border-radius:50px;flex-shrink:0}
        .event-badge.free{background:rgba(61,255,143,.08);color:var(--g);border:1px solid rgba(61,255,143,.2)}
        .event-badge.paid{background:rgba(255,255,255,.05);color:var(--wm);border:1px solid var(--bd)}

        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0}to{opacity:.7}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .7s ease forwards}
        .fu2{animation:fadeUp .7s .15s ease both}
        .fu3{animation:fadeUp .7s .3s ease both}

        @media(max-width:640px){
          .nav,.app-bar,.body,footer{padding-left:20px;padding-right:20px}
          .hero-content{padding-left:20px;padding-right:20px}
          .app-bar{margin-left:20px;margin-right:20px}
          .cta{padding:44px 24px}
          .stat-grid{grid-template-columns:1fr}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/images/calilogobg.png" alt="CaliSpot" />
        </Link>
        <a href={APP_STORE} className="nav-dl" target="_blank" rel="noreferrer">Download on iOS</a>
      </nav>

      {loading && (
        <div className="state">
          <div className="state-icon">⏳</div>
          <div className="state-title">Loading spot…</div>
        </div>
      )}

      {!loading && notFound && (
        <div className="state">
          <div className="state-icon">📍</div>
          <div className="state-title">Spot not found</div>
          <div className="state-sub">This spot may have moved or been removed.</div>
          <Link href="/" className="nav-dl" style={{ marginTop:20 }}>Browse all spots</Link>
        </div>
      )}

      {!loading && spot && (
        <>
          {/* HERO */}
          <div className="hero">
            {spot.images?.length > 0 && (
              <div className="hero-bg">
                <img key={heroIdx} src={`${IMG_BASE}${spot.images[heroIdx]}`} alt={spot.name} />
              </div>
            )}
            <div className="hero-grad" />
            <div className="hero-content">
              <h1 className="hero-title fu2">{spot.name}</h1>
              <div className="hero-meta fu3">
                {spot.nearestTrainStation && <div className="hero-meta-item">{spot.nearestTrainStation}</div>}
                {spot.images?.length > 1 && (
                  <div className="hero-dots">
                    {spot.images.map((_, i) => (
                      <button
                        key={i}
                        className="hero-dot-btn"
                        onClick={() => { setHeroIdx(i); clearInterval(heroTimer.current); }}
                        style={{ width: i === heroIdx ? 20 : 6, background: i === heroIdx ? "#F5C842" : "rgba(255,255,255,.3)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* OPEN IN APP BAR */}
          <div className="app-bar">
            <div className="app-bar-l">
              <div className="app-bar-icon"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
              <div>
                <div className="app-bar-name">Open in CaliSpot</div>
                <div className="app-bar-sub">Check in · See who&apos;s here · Log session</div>
              </div>
            </div>
            <a href={`calispot://s/${spot.slug}`} className="app-bar-btn">Open in App</a>
          </div>

          <div className="body">

            {/* RATINGS */}
            <div className="sec-label">Ratings</div>
            <div style={{ display:"flex", gap:10, marginBottom:32 }}>
              <div className="stat-card" style={{ flex:1 }}>
                <img src="/images/quality.png" alt="Quality" style={{ width:96, height:96, objectFit:"contain", display:"block", margin:"0 auto 10px" }} />
                <div className="stat-name">Equipment Quality</div>
                <Dots val={spot.equipmentQualityRating} />
              </div>
              <div className="stat-card" style={{ flex:1 }}>
                <img src="/images/variety.png" alt="Variety" style={{ width:96, height:96, objectFit:"contain", display:"block", margin:"0 auto 10px" }} />
                <div className="stat-name">Equipment Variety</div>
                <Dots val={spot.equipmentVarietyRating} />
              </div>
            </div>

            {/* EQUIPMENT */}
            {spot.equipment?.length > 0 && (
              <>
                <div className="sec-label">Equipment</div>
                <div className="equip-grid">
                  {spot.equipment.map(eq => EQ_ICONS[eq] && (
                    <div className="equip-card" key={eq}>
                      <img src={EQ_ICONS[eq]} alt={eq} />
                      <span>{EQ_LABELS[eq] || eq}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STATION */}
            {spot.nearestTrainStation && (
              <>
                <div className="sec-label">Getting There</div>
                <div className="station">
                  <img src="/images/train.png" alt="Station" />
                  <div>
                    <div className="station-lbl">Nearest Station</div>
                    <div className="station-name">{spot.nearestTrainStation}</div>
                  </div>
                </div>
              </>
            )}

            {/* SPONSORED PT */}
            {(() => {
              const pts = spot.sponsoredPTs?.length ? spot.sponsoredPTs : spot.sponsoredPT ? [spot.sponsoredPT] : [];
              return pts.length > 0 && (
                <>
                  <div className="sec-label">Personal Trainer</div>
                  {pts.map((pt, i) => (
                    <div className="pt-card" key={i}>
                      <div className="pt-header">
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="#000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="pt-header-text">Sponsored Trainer</span>
                      </div>
                      <div className="pt-body">
                        {pt.avatarURL
                          ? <img src={pt.avatarURL} alt={pt.name} className="pt-avatar" />
                          : <img src="/images/calilogobg.png" alt={pt.name} className="pt-avatar" />
                        }
                        <div className="pt-info">
                          <div className="pt-name">{pt.name}</div>
                          {pt.bio && <div className="pt-bio">{pt.bio}</div>}
                          <div className="pt-links">
                            {pt.instagram && (
                              <a href={`https://instagram.com/${pt.instagram}`} className="pt-link" target="_blank" rel="noreferrer">
                                Instagram
                              </a>
                            )}
                            {pt.tiktok && (
                              <a href={`https://tiktok.com/@${pt.tiktok}`} className="pt-link" target="_blank" rel="noreferrer">
                                TikTok
                              </a>
                            )}
                            {pt.website && (
                              <a href={pt.website} className="pt-link" target="_blank" rel="noreferrer">
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}

            {/* EVENTS */}
            {events.length > 0 && (
              <>
                <div className="sec-label">Upcoming Events</div>
                <div className="event-list">
                  {events.map(ev => {
                    const d = new Date(ev.event_date);
                    const day = d.getDate();
                    const mon = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
                    const time = d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
                    return (
                      <a
                        key={ev.id}
                        href={`/event/${ev.id}`}
                        className="event-card"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="event-date-box">
                          <div className="event-date-day">{day}</div>
                          <div className="event-date-mon">{mon}</div>
                        </div>
                        <div className="event-info">
                          <div className="event-title">{ev.title}</div>
                          <div className="event-meta">
                            {time}{ev.location_name ? ` · ${ev.location_name}` : ""}{ev.organiser_name ? ` · ${ev.organiser_name}` : ""}
                          </div>
                        </div>
                        <span className={`event-badge ${ev.is_free ? "free" : "paid"}`}>
                          {ev.is_free ? "Free" : ev.price ? `£${Math.round(ev.price)}` : "Paid"}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}

            {/* PHOTO STRIP */}
            {spot.images?.length > 1 && (
              <>
                <div className="sec-label">Photos</div>
                <div className="photo-strip">
                  {spot.images.map((img, i) => (
                    <div className="photo-thumb" key={i} onClick={() => setActiveImg(i)}>
                      <img src={`${IMG_BASE}${img}`} alt={`${spot.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* MAP */}
            {spot.lat && spot.lng && (
              <>
                <div className="sec-label">Location</div>
                <div className="map-wrap">
                  <iframe
                    title={spot.name}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    srcDoc={`<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>html,body,#m{margin:0;width:100%;height:100%}</style>
</head><body>
<div id="m"></div>
<script>
var map=L.map('m',{zoomControl:true,attributionControl:false}).setView([${spot.lat},${spot.lng}],15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var icon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;background:#F5C842;border:2px solid #0a0a0a;border-radius:50%;box-shadow:0 0 8px rgba(245,200,66,.4)"></div>',iconSize:[16,16],iconAnchor:[8,8]});
L.marker([${spot.lat},${spot.lng}],{icon:icon}).addTo(map).bindPopup('<b>${spot.name.replace(/'/g, "\\'")}</b>');
<\/script>
</body></html>`}
                  />
                </div>
              </>
            )}

            {/* CTA */}
            <div className="cta">
              <div className="cta-eyb">Download on iOS</div>
              <h2>Train here.<br />For free.</h2>
              <p>Find every outdoor calisthenics spot near you. Check in, log sessions, connect with your crew.</p>
              <a href={APP_STORE} className="cta-btn" target="_blank" rel="noreferrer">Download CaliSpot</a>
              <div className="cta-sub">Free forever · No ads · iOS</div>
            </div>

          </div>
        </>
      )}

      {/* FULLSCREEN IMAGE */}
      {activeImg !== null && spot && (
        <div className="overlay" onClick={() => setActiveImg(null)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button className="overlay-close" onClick={e => { e.stopPropagation(); setActiveImg(null); }}>✕</button>
          <button className="overlay-arrow" style={{ left:0 }} onClick={e => { e.stopPropagation(); setActiveImg(p => p === 0 ? spot.images.length-1 : p-1); }}>‹</button>
          <img src={`${IMG_BASE}${spot.images[activeImg]}`} alt="" onClick={e => e.stopPropagation()} />
          <button className="overlay-arrow" style={{ right:0 }} onClick={e => { e.stopPropagation(); setActiveImg(p => p === spot.images.length-1 ? 0 : p+1); }}>›</button>
        </div>
      )}

      <footer>
        <div className="f-links">
          <Link href="/privacy">Privacy Policy</Link>
          <a href="mailto:8mindltd@gmail.com">Contact</a>
          <a href={APP_STORE} target="_blank" rel="noreferrer">App Store</a>
          <a href="https://www.instagram.com/calispot.xyz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="f-copy">© 2026 Tyrese Bewry · 8MIND LTD</div>
      </footer>
    </>
  );
}