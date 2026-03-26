// pages/index.js
// CaliSpot — Discovery landing page
// Spots map + list, events, trainers, Android waitlist, conversion CTAs

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const APP_STORE    = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const SUPABASE_URL = "https://nrfwyewylurdmsnxycwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnd5ZXd5bHVyZG1zbnh5Y3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc4MTIsImV4cCI6MjA4NzA5MzgxMn0.QJCdBm0Fa3xX1TsOJ5bLEodKpcgGjniz8vEM-_RA8wc";
const IMG_BASE     = "https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/images/";
const FONTS        = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

const EQ_LABELS = {
  abs: "Abs", dipBars: "Dip Bars", lowBars: "Low Bars",
  monkeyBars: "Monkey Bars", pullUpBars: "Pull-Up Bars",
};

/* ─── Waitlist submit helper ─────────────────────────────────────────────── */
async function submitWaitlist(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/android_waitlist`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (txt.includes("duplicate") || txt.includes("unique")) {
      return { ok: true, duplicate: true };
    }
    throw new Error("Failed to submit");
  }
  return { ok: true };
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [spots, setSpots]           = useState([]);
  const [events, setEvents]         = useState([]);
  const [trainers, setTrainers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState("map"); // "map" | "list"
  const [searchQ, setSearchQ]       = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("idle"); // idle | sending | done | error
  const [mobileMenu, setMobileMenu] = useState(false);

  /* ── Fetch spots ─────────────────────────────────────────────────────── */
  useEffect(() => {
    fetch(`${SUPABASE_URL}/storage/v1/object/public/spots/spots.json`, { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        setSpots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ── Fetch events ────────────────────────────────────────────────────── */
  useEffect(() => {
    const now = new Date().toISOString();
    fetch(
      `${SUPABASE_URL}/rest/v1/events?event_date=gte.${now}&order=event_date.asc&limit=12&select=id,title,event_date,location_name,is_free,price,join_url,organiser_name,spot_slug`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, []);

  /* ── Extract trainers from spots ─────────────────────────────────────── */
  useEffect(() => {
    if (!spots.length) return;
    const map = new Map();
    spots.forEach(s => {
      const pts = s.sponsoredPTs?.length ? s.sponsoredPTs : s.sponsoredPT ? [s.sponsoredPT] : [];
      pts.forEach(pt => {
        if (pt.name && !map.has(pt.name)) {
          map.set(pt.name, { ...pt, spotName: s.name, spotSlug: s.slug });
        }
      });
    });
    setTrainers(Array.from(map.values()));
  }, [spots]);

  /* ── Filtered spots ──────────────────────────────────────────────────── */
  const filtered = spots.filter(s =>
    !searchQ || s.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.nearestTrainStation?.toLowerCase().includes(searchQ.toLowerCase())
  );

  /* ── Waitlist submit ─────────────────────────────────────────────────── */
  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistEmail || waitlistStatus === "sending") return;
    setWaitlistStatus("sending");
    try {
      await submitWaitlist(waitlistEmail);
      setWaitlistStatus("done");
      setWaitlistEmail("");
    } catch {
      setWaitlistStatus("error");
    }
  };

  /* ── Smooth scroll ───────────────────────────────────────────────────── */
  const scrollTo = (id) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Stats ───────────────────────────────────────────────────────────── */
  const totalSpots = spots.length;
  const totalEquipment = spots.reduce((a, s) => a + (s.equipment?.length || 0), 0);

  return (
    <>
      <Head>
        <title>CaliSpot — Find Outdoor Calisthenics Spots Near You</title>
        <meta name="description" content="Discover the best outdoor calisthenics parks and workout spots. Browse locations, upcoming events, and connect with trainers. Free on iOS." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="CaliSpot — Find Outdoor Calisthenics Spots" />
        <meta property="og:description" content="Discover calisthenics parks, browse events, and connect with trainers near you." />
        <meta property="og:image" content="https://www.calispot.xyz/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.calispot.xyz" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/images/calilogobg.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={FONTS} rel="stylesheet" />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --y:#F5C842;--g:#3DFF8F;--bg:#0a0a0a;--bg2:#111;--card:#141414;
          --bd:rgba(255,255,255,.07);--w:rgba(255,255,255,.92);--wm:rgba(255,255,255,.4);
          --font:'Bricolage Grotesque',sans-serif;--mono:'DM Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:var(--font);overflow-x:hidden;min-height:100vh}

        /* ── NAV ────────────────────────────────────────────────────────── */
        .nav{position:sticky;top:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;background:rgba(10,10,10,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--bd)}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nav-logo img{width:51px;height:51px;border-radius:50%}
        .nav-logo span{font-size:1rem;font-weight:800;letter-spacing:-.02em;color:var(--w)}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-link{font-family:var(--mono);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;color:var(--wm);text-decoration:none;cursor:pointer;transition:color .2s;background:none;border:none;padding:0}
        .nav-link:hover{color:var(--w)}
        .nav-dl{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0a0a0a;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.55rem 1.3rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s;white-space:nowrap}
        .nav-dl:hover{transform:scale(1.04);box-shadow:0 0 24px rgba(245,200,66,.45)}
        .nav-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px}
        .nav-hamburger span{display:block;width:22px;height:2px;background:var(--w);margin:5px 0;transition:all .3s}

        /* ── MOBILE MENU ───────────────────────────────────────────────── */
        .mobile-menu{display:none;position:fixed;inset:0;top:68px;background:rgba(10,10,10,.98);backdrop-filter:blur(24px);z-index:899;padding:32px 24px;flex-direction:column;gap:24px}
        .mobile-menu.open{display:flex}
        .mobile-menu .nav-link{font-size:.85rem;letter-spacing:.1em;color:var(--w)}
        .mobile-menu .nav-dl{text-align:center;justify-content:center;padding:.75rem 1.5rem;font-size:.8rem;width:100%}

        /* ── HERO ───────────────────────────────────────────────────────── */
        .hero{position:relative;padding:100px 48px 80px;overflow:hidden;min-height:min(85vh,700px);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
        .hero-glow{position:absolute;top:-40%;left:-10%;width:60%;height:120%;background:radial-gradient(ellipse at center,rgba(245,200,66,.06) 0%,transparent 70%);pointer-events:none}
        .hero-glow2{position:absolute;bottom:-30%;right:-10%;width:50%;height:100%;background:radial-gradient(ellipse at center,rgba(61,255,143,.03) 0%,transparent 70%);pointer-events:none}
        .hero-eyb{font-family:var(--mono);font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:20px;display:flex;align-items:center;gap:10px;position:relative;justify-content:center}
        .hero-eyb::before{content:'';width:28px;height:1px;background:var(--y);flex-shrink:0}
        .hero-title{font-size:clamp(3rem,8vw,7rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:#fff;margin-bottom:20px;position:relative;max-width:900px;text-align:center}
        .hero-title .accent{color:var(--y)}
        .hero-sub{font-size:clamp(.95rem,2vw,1.15rem);color:var(--wm);line-height:1.7;max-width:520px;margin-bottom:36px;position:relative;text-align:center}
        .hero-actions{display:flex;gap:14px;align-items:center;flex-wrap:wrap;position:relative;justify-content:center}
        .hero-btn{display:inline-flex;align-items:center;gap:8px;background:var(--y);color:#0a0a0a;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.95rem 2rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .hero-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(245,200,66,.35)}
        .hero-btn-sec{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid var(--bd);color:var(--w);font-size:.78rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:.95rem 2rem;border-radius:50px;text-decoration:none;transition:all .2s;cursor:pointer}
        .hero-btn-sec:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}
        .hero-stats{display:flex;gap:32px;margin-top:48px;position:relative;justify-content:center}
        .hero-stat-num{font-size:2.4rem;font-weight:900;letter-spacing:-.03em;color:var(--y);line-height:1}
        .hero-stat-label{font-family:var(--mono);font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--wm);margin-top:4px}

        /* ── SECTION COMMON ─────────────────────────────────────────────── */
        .section{padding:80px 48px}
        .sec-label{font-family:var(--mono);font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);display:flex;align-items:center;gap:10px;margin-bottom:16px}
        .sec-label::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}
        .sec-title{font-size:clamp(2rem,5vw,3.8rem);font-weight:900;line-height:.92;letter-spacing:-.04em;color:#fff;margin-bottom:12px}
        .sec-sub{font-size:.95rem;color:var(--wm);line-height:1.6;max-width:480px;margin-bottom:40px}
        .divider{height:1px;background:var(--bd);margin:0 48px}

        /* ── SPOTS SECTION ──────────────────────────────────────────────── */
        .spots-controls{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
        .spots-search{flex:1;min-width:200px;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:12px 16px;color:var(--w);font-family:var(--font);font-size:.88rem;outline:none;transition:border-color .2s}
        .spots-search::placeholder{color:rgba(255,255,255,.2)}
        .spots-search:focus{border-color:rgba(245,200,66,.3)}
        .view-toggle{display:flex;border:1px solid var(--bd);border-radius:10px;overflow:hidden;flex-shrink:0}
        .view-btn{background:transparent;border:none;color:var(--wm);font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;padding:10px 16px;cursor:pointer;transition:all .2s}
        .view-btn.active{background:rgba(245,200,66,.1);color:var(--y)}

        .map-container{width:100%;height:clamp(320px,50vh,520px);border-radius:20px;overflow:hidden;border:1px solid var(--bd);margin-bottom:24px;background:var(--bg2)}
        .map-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--wm);font-size:.85rem}

        .spot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
        .spot-card{background:var(--bg2);border:1px solid var(--bd);border-radius:18px;overflow:hidden;transition:border-color .3s,transform .3s;text-decoration:none;display:block}
        .spot-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-3px)}
        .spot-card-img{width:100%;height:160px;object-fit:cover;display:block;background:#1a1a1a}
        .spot-card-body{padding:16px}
        .spot-card-name{font-size:1rem;font-weight:800;color:#fff;margin-bottom:4px}
        .spot-card-loc{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);margin-bottom:10px;display:flex;align-items:center;gap:4px}
        .spot-card-eq{display:flex;gap:6px;flex-wrap:wrap}
        .spot-card-eq span{font-family:var(--mono);font-size:.48rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;background:rgba(255,255,255,.05);color:var(--wm);border:1px solid var(--bd)}
        .spot-card-activity{font-family:var(--mono);font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;color:var(--g);margin-top:10px;display:flex;align-items:center;gap:5px}
        .spot-card-activity::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--g);animation:pulse 2s infinite}

        .spot-cta{text-align:center;margin-top:28px}
        .spot-cta-link{display:inline-flex;align-items:center;gap:8px;background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.2);color:var(--y);font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:.75rem 1.8rem;border-radius:50px;text-decoration:none;transition:all .2s}
        .spot-cta-link:hover{background:rgba(245,200,66,.15);transform:translateY(-1px)}

        /* ── EVENTS ─────────────────────────────────────────────────────── */
        .event-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
        .event-card{background:var(--bg2);border:1px solid var(--bd);border-radius:18px;padding:20px;display:flex;gap:16px;transition:border-color .3s,transform .3s;text-decoration:none}
        .event-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-2px)}
        .event-card.featured{border-color:rgba(245,200,66,.2);background:linear-gradient(135deg,rgba(245,200,66,.04),var(--bg2))}
        .ev-date-box{background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.15);border-radius:14px;padding:10px 14px;text-align:center;flex-shrink:0;min-width:56px;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .ev-date-day{font-size:1.6rem;font-weight:900;color:var(--y);line-height:1}
        .ev-date-mon{font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;color:var(--wm);margin-top:2px}
        .ev-info{flex:1;min-width:0}
        .ev-featured-badge{font-family:var(--mono);font-size:.48rem;letter-spacing:.12em;text-transform:uppercase;color:#0a0a0a;background:var(--y);padding:2px 8px;border-radius:20px;display:inline-block;margin-bottom:6px;font-weight:700}
        .ev-title{font-size:1rem;font-weight:700;color:#fff;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ev-meta{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);line-height:1.6}
        .ev-badge{font-family:var(--mono);font-size:.52rem;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .7rem;border-radius:50px;flex-shrink:0;align-self:flex-start;margin-top:2px}
        .ev-badge.free{background:rgba(61,255,143,.08);color:var(--g);border:1px solid rgba(61,255,143,.2)}
        .ev-badge.paid{background:rgba(255,255,255,.05);color:var(--wm);border:1px solid var(--bd)}
        .ev-app-prompt{margin-top:28px;text-align:center;padding:20px;background:rgba(245,200,66,.04);border:1px solid rgba(245,200,66,.12);border-radius:16px}
        .ev-app-prompt p{font-size:.85rem;color:var(--wm);margin-bottom:12px}

        /* ── TRAINERS ──────────────────────────────────────────────────── */
        .trainer-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
        .trainer-card{background:var(--bg2);border:1px solid var(--bd);border-radius:18px;overflow:hidden;transition:border-color .3s,transform .3s}
        .trainer-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-2px)}
        .trainer-card-header{background:var(--y);padding:6px 16px;display:flex;align-items:center;gap:6px}
        .trainer-card-header span{font-family:var(--mono);font-size:.52rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#000}
        .trainer-card-body{padding:20px;display:flex;gap:16px;align-items:flex-start}
        .trainer-avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--bd);background:#1a1a1a}
        .trainer-info{flex:1;min-width:0}
        .trainer-name{font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:2px}
        .trainer-spot{font-family:var(--mono);font-size:.52rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);margin-bottom:8px}
        .trainer-bio{font-size:.82rem;color:var(--wm);line-height:1.5;margin-bottom:12px}
        .trainer-links{display:flex;gap:8px;flex-wrap:wrap}
        .trainer-link{display:inline-flex;align-items:center;gap:4px;font-family:var(--mono);font-size:.52rem;letter-spacing:.08em;text-transform:uppercase;color:#000;background:var(--y);padding:.35rem .8rem;border-radius:50px;text-decoration:none;font-weight:700;transition:transform .2s}
        .trainer-link:hover{transform:scale(1.04)}

        /* ── ANDROID WAITLIST ──────────────────────────────────────────── */
        .waitlist{background:var(--card);border:1px solid var(--bd);border-radius:24px;padding:48px;margin:80px 48px;text-align:center}
        .waitlist-icon{font-size:2.4rem;margin-bottom:16px}
        .waitlist h2{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;letter-spacing:-.03em;color:#fff;margin-bottom:8px}
        .waitlist p{font-size:.9rem;color:var(--wm);margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.6}
        .waitlist-form{display:flex;gap:10px;max-width:440px;margin:0 auto;justify-content:center}
        .waitlist-input{flex:1;min-width:0;background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:14px 18px;color:var(--w);font-family:var(--font);font-size:.9rem;outline:none;transition:border-color .2s}
        .waitlist-input::placeholder{color:rgba(255,255,255,.2)}
        .waitlist-input:focus{border-color:rgba(245,200,66,.3)}
        .waitlist-submit{background:var(--y);color:#0a0a0a;font-weight:800;font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;padding:14px 24px;border-radius:12px;border:none;cursor:pointer;transition:transform .2s;white-space:nowrap}
        .waitlist-submit:hover{transform:scale(1.04)}
        .waitlist-submit:disabled{opacity:.5;cursor:default;transform:none}
        .waitlist-done{color:var(--g);font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;margin-top:12px}
        .waitlist-error{color:#ff6b6b;font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;margin-top:12px}

        /* ── BOTTOM CTA ────────────────────────────────────────────────── */
        .cta{position:relative;overflow:hidden;background:var(--y);border-radius:28px;padding:64px 48px;text-align:center;margin:0 48px 80px}
        .cta-eyb{font-family:var(--mono);font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(0,0,0,.45);margin-bottom:14px}
        .cta h2{font-size:clamp(2.4rem,7vw,5rem);font-weight:900;letter-spacing:-.04em;line-height:.9;color:#0a0a0a;margin-bottom:16px}
        .cta p{font-size:.92rem;color:rgba(0,0,0,.5);margin-bottom:28px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.6}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#0a0a0a;color:var(--y);font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:1rem 2.2rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,.25)}
        .cta-sub{margin-top:14px;font-family:var(--mono);font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.35)}

        /* ── FOOTER ────────────────────────────────────────────────────── */
        footer{border-top:1px solid var(--bd);padding:32px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .f-links{display:flex;gap:2rem;flex-wrap:wrap}
        .f-links a{font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;color:rgba(255,255,255,.18);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .f-links a:hover{color:var(--wm)}
        .f-copy{font-family:var(--mono);font-size:.52rem;color:rgba(255,255,255,.1)}

        /* ── ANIMATIONS ────────────────────────────────────────────────── */
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .7s ease forwards}
        .fu2{animation:fadeUp .7s .15s ease both}
        .fu3{animation:fadeUp .7s .3s ease both}
        .fu4{animation:fadeUp .7s .45s ease both}

        /* ── RESPONSIVE ────────────────────────────────────────────────── */
        @media(max-width:768px){
          .nav{padding:0 20px}
          .nav-links{display:none}
          .nav-hamburger{display:block}
          .hero{padding:72px 20px 60px;min-height:auto}
          .hero-stats{gap:20px}
          .hero-stat-num{font-size:1.8rem}
          .section{padding:60px 20px}
          .divider{margin:0 20px}
          .spot-grid{grid-template-columns:1fr}
          .event-grid{grid-template-columns:1fr}
          .trainer-grid{grid-template-columns:1fr}
          .waitlist{margin:60px 20px;padding:32px 20px}
          .waitlist-form{flex-direction:column}
          .waitlist-submit{width:100%}
          .cta{margin:0 20px 60px;padding:44px 24px;border-radius:22px}
          footer{padding:24px 20px}
          .spots-controls{flex-direction:column;align-items:stretch}
          .view-toggle{align-self:flex-start}
        }
        @media(max-width:480px){
          .hero-title{font-size:clamp(2.4rem,12vw,3.4rem)}
          .hero-actions{flex-direction:column;align-items:stretch}
          .hero-btn,.hero-btn-sec{justify-content:center;text-align:center}
          .hero-stats{flex-direction:column;gap:12px}
          .event-card{flex-direction:column;gap:12px}
          .ev-date-box{flex-direction:row;gap:8px;padding:8px 14px}
          .ev-date-day{font-size:1.1rem}
        }
        @media(min-width:1200px){
          .nav,.hero,.section,.divider{max-width:1400px;margin-left:auto;margin-right:auto}
          .waitlist,.cta{max-width:1300px;margin-left:auto;margin-right:auto}
          footer{max-width:1400px;margin-left:auto;margin-right:auto}
        }
      `}</style>

      {/* ═══════════════════════ NAV ═══════════════════════════════════════ */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/images/calilogobg.png" alt="CaliSpot" />
        </Link>
        <div className="nav-links">
          <button className="nav-link" onClick={() => scrollTo("spots")}>Spots</button>
          <button className="nav-link" onClick={() => scrollTo("events")}>Events</button>
          <button className="nav-link" onClick={() => scrollTo("trainers")}>Trainers</button>
          <a href={APP_STORE} className="nav-dl" target="_blank" rel="noreferrer">
            Download on iOS
          </a>
        </div>
        <button className="nav-hamburger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
          <span style={mobileMenu ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
          <span style={mobileMenu ? { opacity: 0 } : {}} />
          <span style={mobileMenu ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenu ? "open" : ""}`}>
        <button className="nav-link" onClick={() => scrollTo("spots")}>Spots</button>
        <button className="nav-link" onClick={() => scrollTo("events")}>Events</button>
        <button className="nav-link" onClick={() => scrollTo("trainers")}>Trainers</button>
        <button className="nav-link" onClick={() => scrollTo("android")}>Android Waitlist</button>
        <a href={APP_STORE} className="nav-dl" target="_blank" rel="noreferrer">
          Download on iOS
        </a>
      </div>

      {/* ═══════════════════════ HERO ══════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-eyb fu">Find your next spot</div>
        <h1 className="hero-title fu2">
          Train<br />
          <span className="accent">Anywhere.</span>
        </h1>
        <p className="hero-sub fu3">
          Discover the best outdoor calisthenics parks near you. Browse spots,
          find events, and connect with trainers — all for free.
        </p>
        <div className="hero-actions fu4">
          <a href={APP_STORE} className="hero-btn" target="_blank" rel="noreferrer">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Download on iOS
          </a>
          <button className="hero-btn-sec" onClick={() => scrollTo("spots")}>
            Browse Spots
          </button>
        </div>
        {!loading && (
          <div className="hero-stats fu4">
            <div>
              <div className="hero-stat-num">{totalSpots}</div>
              <div className="hero-stat-label">Spots</div>
            </div>
            <div>
              <div className="hero-stat-num">{totalEquipment}</div>
              <div className="hero-stat-label">Equipment Stations</div>
            </div>
            <div>
              <div className="hero-stat-num">{events.length}+</div>
              <div className="hero-stat-label">Upcoming Events</div>
            </div>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ═══════════════════════ SPOTS ═════════════════════════════════════ */}
      <section className="section" id="spots">
        <div className="sec-label">Explore</div>
        <h2 className="sec-title">Spots</h2>
        <p className="sec-sub">
          Every outdoor calisthenics park, mapped and rated. Find pull-up bars,
          dip stations, and more near you.
        </p>

        <div className="spots-controls">
          <input
            type="text"
            className="spots-search"
            placeholder="Search spots by name or station…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          <div className="view-toggle">
            <button className={`view-btn ${view === "map" ? "active" : ""}`} onClick={() => setView("map")}>Map</button>
            <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
          </div>
        </div>

        {view === "map" && (
          <div className="map-container">
            {!loading && filtered.length > 0 ? (
              <iframe
                title="All CaliSpot locations"
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
var spots=${JSON.stringify(filtered.filter(s=>s.lat&&s.lng).map(s=>({lat:s.lat,lng:s.lng,name:s.name,slug:s.slug,station:s.nearestTrainStation||""})))};
var map=L.map('m',{zoomControl:true,attributionControl:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var icon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;background:#F5C842;border:2px solid #0a0a0a;border-radius:50%;box-shadow:0 0 8px rgba(245,200,66,.4)"></div>',iconSize:[16,16],iconAnchor:[8,8]});
var bounds=[];
spots.forEach(function(s){
  var m=L.marker([s.lat,s.lng],{icon:icon}).addTo(map);
  m.bindPopup('<div style="font-family:-apple-system,sans-serif;min-width:140px"><b>'+s.name+'</b>'+(s.station?'<br><span style="font-size:11px;color:#666">📍 '+s.station+'</span>':'')+'<br><a href="/s/'+s.slug+'" target="_top" style="display:inline-block;margin-top:6px;background:#F5C842;color:#000;font-weight:700;font-size:11px;padding:5px 12px;border-radius:16px;text-decoration:none">View Spot</a></div>');
  bounds.push([s.lat,s.lng]);
});
if(bounds.length>1)map.fitBounds(bounds,{padding:[30,30]});
else if(bounds.length===1)map.setView(bounds[0],14);
else map.setView([51.505,-0.09],6);
<\/script>
</body></html>`}
              />
            ) : (
              <div className="map-placeholder">
                {loading ? "Loading spots…" : "No spots found"}
              </div>
            )}
          </div>
        )}

        {(view === "list" || view === "map") && (
          <div className="spot-grid">
            {filtered.slice(0, view === "map" ? 6 : 50).map(s => (
              <Link href={`/s/${s.slug}`} key={s.slug} className="spot-card">
                {s.images?.[0] ? (
                  <img className="spot-card-img" src={`${IMG_BASE}${s.images[0]}`} alt={s.name} loading="lazy" />
                ) : (
                  <div className="spot-card-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--wm)", fontSize: ".8rem" }}>No photo</div>
                )}
                <div className="spot-card-body">
                  <div className="spot-card-name">{s.name}</div>
                  {s.nearestTrainStation && (
                    <div className="spot-card-loc">📍 {s.nearestTrainStation}</div>
                  )}
                  <div className="spot-card-eq">
                    {(s.equipment || []).slice(0, 4).map(eq => (
                      <span key={eq}>{EQ_LABELS[eq] || eq}</span>
                    ))}
                  </div>
                  <div className="spot-card-activity">
                    Active spot
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {view === "map" && filtered.length > 6 && (
          <div className="spot-cta">
            <button className="spot-cta-link" onClick={() => setView("list")}>
              View all {filtered.length} spots
            </button>
          </div>
        )}

        {/* Spot-level app CTA */}
        <div className="ev-app-prompt" style={{ marginTop: 32 }}>
          <p>Check in, log sessions, and see who&apos;s training — in the app.</p>
          <a href={APP_STORE} className="hero-btn" target="_blank" rel="noreferrer" style={{ fontSize: ".7rem", padding: ".7rem 1.6rem" }}>
            Get the Full Experience
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════ EVENTS ════════════════════════════════════ */}
      <section className="section" id="events">
        <div className="sec-label">What&apos;s On</div>
        <h2 className="sec-title">Events</h2>
        <p className="sec-sub">
          Upcoming jams, workshops, and outdoor sessions. Show up and train
          with the community.
        </p>

        {events.length === 0 ? (
          <div style={{ color: "var(--wm)", fontSize: ".88rem" }}>
            No upcoming events right now — check back soon or browse events in the app.
          </div>
        ) : (
          <div className="event-grid">
            {events.map(ev => {
              const d = new Date(ev.event_date);
              const day = d.getDate();
              const mon = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
              const time = d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
              return (
                <a
                  key={ev.id}
                  href={ev.join_url || APP_STORE}
                  className="event-card"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="ev-date-box">
                    <div className="ev-date-day">{day}</div>
                    <div className="ev-date-mon">{mon}</div>
                  </div>
                  <div className="ev-info">
                    <div className="ev-title">{ev.title}</div>
                    <div className="ev-meta">
                      {time}
                      {ev.location_name ? ` · ${ev.location_name}` : ""}
                      {ev.organiser_name ? ` · ${ev.organiser_name}` : ""}
                    </div>
                  </div>
                  <span className={`ev-badge ${ev.is_free ? "free" : "paid"}`}>
                    {ev.is_free ? "Free" : ev.price ? `£${Math.round(ev.price)}` : "Paid"}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        <div className="ev-app-prompt">
          <p>RSVP, get directions, and connect with the host — in the app.</p>
          <a href={APP_STORE} className="hero-btn" target="_blank" rel="noreferrer" style={{ fontSize: ".7rem", padding: ".7rem 1.6rem" }}>
            Open Events in App
          </a>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════ TRAINERS ══════════════════════════════════ */}
      <section className="section" id="trainers">
        <div className="sec-label">Community</div>
        <h2 className="sec-title">Trainers</h2>
        <p className="sec-sub">
          Meet the coaches and athletes making outdoor training accessible.
        </p>

        {trainers.length === 0 ? (
          <div style={{ color: "var(--wm)", fontSize: ".88rem" }}>
            Trainer profiles are coming soon. Download the app to find trainers near you.
          </div>
        ) : (
          <div className="trainer-grid">
            {trainers.map((t, i) => (
              <div className="trainer-card" key={i}>
                <div className="trainer-card-header">
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="#000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>Sponsored Trainer</span>
                </div>
                <div className="trainer-card-body">
                  <img
                    src={t.avatarURL || "/images/calilogobg.png"}
                    alt={t.name}
                    className="trainer-avatar"
                    loading="lazy"
                  />
                  <div className="trainer-info">
                    <div className="trainer-name">{t.name}</div>
                    <div className="trainer-spot">📍 {t.spotName}</div>
                    {t.bio && <div className="trainer-bio">{t.bio}</div>}
                    <div className="trainer-links">
                      {t.instagram && (
                        <a href={`https://instagram.com/${t.instagram}`} className="trainer-link" target="_blank" rel="noreferrer">
                          Instagram
                        </a>
                      )}
                      {t.tiktok && (
                        <a href={`https://tiktok.com/@${t.tiktok}`} className="trainer-link" target="_blank" rel="noreferrer">
                          TikTok
                        </a>
                      )}
                      {t.website && (
                        <a href={t.website} className="trainer-link" target="_blank" rel="noreferrer">
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ═══════════════════════ ANDROID WAITLIST ══════════════════════════ */}
      <div className="waitlist" id="android">
        <div className="waitlist-icon">🤖</div>
        <h2>Android Coming Soon</h2>
        <p>Be the first to know when CaliSpot lands on Android. Drop your email and we&apos;ll let you know.</p>
        {waitlistStatus === "done" ? (
          <div className="waitlist-done">✅ You&apos;re on the list — we&apos;ll be in touch!</div>
        ) : (
          <>
            <div className="waitlist-form">
              <input
                type="email"
                className="waitlist-input"
                placeholder="your@email.com"
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleWaitlist(e)}
              />
              <button
                className="waitlist-submit"
                onClick={handleWaitlist}
                disabled={waitlistStatus === "sending" || !waitlistEmail}
              >
                {waitlistStatus === "sending" ? "Submitting…" : "Notify Me"}
              </button>
            </div>
            {waitlistStatus === "error" && (
              <div className="waitlist-error">Something went wrong — please try again.</div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════════════ BOTTOM CTA ════════════════════════════════ */}
      <div className="cta">
        <div className="cta-eyb">Download on iOS</div>
        <h2>Train<br />anywhere.</h2>
        <p>
          Every outdoor calisthenics spot near you. Check in, log sessions,
          connect with your crew.
        </p>
        <a href={APP_STORE} className="cta-btn" target="_blank" rel="noreferrer">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Download CaliSpot
        </a>
        <div className="cta-sub">Free forever · No ads · iOS</div>
      </div>

      {/* ═══════════════════════ FOOTER ════════════════════════════════════ */}
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