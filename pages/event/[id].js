// pages/event/[id].js
// CaliSpot — Event detail web page
// Shared via EventShareSheet in-app. Shows event info, spot link, deep link to app.
// If app not installed, shows App Store download CTA.

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const APP_STORE    = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const SUPABASE_URL = "https://nrfwyewylurdmsnxycwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnd5ZXd5bHVyZG1zbnh5Y3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTc4MTIsImV4cCI6MjA4NzA5MzgxMn0.QJCdBm0Fa3xX1TsOJ5bLEodKpcgGjniz8vEM-_RA8wc";
const FONTS        = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

export default function EventPage() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [goingCount, setGoingCount] = useState(0);
  const [spotCoords, setSpotCoords] = useState(null); // { lat, lng }

  const [fullscreenImg, setFullscreenImg] = useState(false);

  // Fetch event from Supabase
  useEffect(() => {
    if (!id) return;
    fetch(
      `${SUPABASE_URL}/rest/v1/events?id=eq.${id}&select=id,title,description,spot_slug,spot_name,event_date,location_name,organiser_name,is_free,join_url,price,image_url`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvent(data[0]);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  // Fetch going count
  useEffect(() => {
    if (!id) return;
    fetch(
      `${SUPABASE_URL}/rest/v1/event_interests?event_id=eq.${id}&select=event_id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setGoingCount(data.length) : null)
      .catch(() => {});
  }, [id]);

  // Fetch spot coordinates for map (from spots.json using spot_slug)
  useEffect(() => {
    if (!event?.spot_slug) return;
    fetch("https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/spots/spots.json", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        const found = data.find(s => s.slug === event.spot_slug);
        if (found?.lat && found?.lng) {
          setSpotCoords({ lat: found.lat, lng: found.lng, name: found.name || event.spot_name });
        }
      })
      .catch(() => {});
  }, [event]);

  // Try to open in app silently
  useEffect(() => {
    if (!id) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `calispot://event/${id}`;
    document.body.appendChild(iframe);
    const t = setTimeout(() => {
      try { document.body.removeChild(iframe); } catch {}
    }, 1000);
    return () => {
      clearTimeout(t);
      try { document.body.removeChild(iframe); } catch {}
    };
  }, [id]);

  // Format helpers
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };
  const fmtDay = (iso) => new Date(iso).getDate();
  const fmtMonth = (iso) => new Date(iso).toLocaleString("en-GB", { month: "short" }).toUpperCase();

  const title = event ? `${event.title} — CaliSpot` : "Event — CaliSpot";
  const desc  = event
    ? `${event.title} at ${event.spot_name || event.location_name || "a CaliSpot"}. ${event.is_free ? "Free entry." : ""} Open in CaliSpot to RSVP.`
    : "Community workout event on CaliSpot.";
  const ogImage = event?.image_url || "/images/calilogobg.png";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-itunes-app" content={`app-id=6747050360, app-argument=calispot://event/${id || ""}`} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image"       content={ogImage} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={`https://www.calispot.xyz/event/${id || ""}`} />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={title} />
        <meta name="twitter:description" content={desc} />
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

        .wrap{max-width:620px;margin:0 auto;padding:32px 24px 100px}

        .hero-img-wrap{position:relative;width:100%;border-radius:20px;border:1px solid var(--bd);margin-bottom:24px;overflow:hidden;background:#111;cursor:pointer}
        .hero-img-wrap img{width:100%;height:auto;max-height:400px;object-fit:contain;display:block}

        .img-overlay{position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out}
        .img-overlay img{max-width:94%;max-height:85vh;object-fit:contain;border-radius:12px}
        .img-overlay-close{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10000}
        .img-overlay-close:hover{background:rgba(255,255,255,.2)}

        .date-block{display:flex;align-items:center;gap:20px;margin-bottom:24px}
        .date-box{background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.15);border-radius:16px;padding:14px 20px;text-align:center;flex-shrink:0;min-width:72px}
        .date-day{font-size:2.2rem;font-weight:900;color:var(--y);line-height:1}
        .date-mon{font-family:var(--mono);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--wm);margin-top:4px}
        .date-info{flex:1}
        .date-full{font-size:.95rem;font-weight:700;color:#fff}
        .date-time{font-family:var(--mono);font-size:.7rem;color:var(--wm);margin-top:4px}

        .event-title{font-size:clamp(1.8rem,5vw,2.8rem);font-weight:900;line-height:1.05;letter-spacing:-.02em;color:#fff;margin-bottom:16px}

        .badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
        .badge{font-family:var(--mono);font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.4rem .9rem;border-radius:50px}
        .badge.free{background:rgba(61,255,143,.08);color:var(--g);border:1px solid rgba(61,255,143,.2)}
        .badge.paid{background:rgba(255,165,0,.08);color:#ffa500;border:1px solid rgba(255,165,0,.2)}
        .badge.going{background:rgba(61,255,143,.08);color:var(--g);border:1px solid rgba(61,255,143,.2)}

        .meta{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
        .meta-row{display:flex;align-items:center;gap:10px;font-size:.88rem;color:var(--wm)}
        .meta-icon{font-size:1rem;width:20px;text-align:center}

        .desc{font-size:.92rem;line-height:1.6;color:rgba(255,255,255,.7);margin-bottom:32px}

        .spot-link{display:flex;align-items:center;gap:14px;background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:16px 20px;text-decoration:none;margin-bottom:24px;transition:border-color .3s,transform .3s}
        .spot-link:hover{border-color:rgba(245,200,66,.3);transform:translateY(-2px)}
        .spot-icon{width:44px;height:44px;border-radius:12px;overflow:hidden;flex-shrink:0;background:rgba(245,200,66,.08);display:flex;align-items:center;justify-content:center}
        .spot-icon img{width:100%;height:100%;object-fit:cover}
        .spot-text{flex:1}
        .spot-name{font-size:.95rem;font-weight:700;color:#fff}
        .spot-sub{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);margin-top:2px}
        .spot-arrow{color:var(--wm);font-size:1.1rem}

        .map-wrap{border-radius:20px;overflow:hidden;height:260px;border:1px solid var(--bd);margin-bottom:24px}

        .actions{display:flex;flex-direction:column;gap:10px;margin-bottom:32px}
        .btn-primary{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--y);color:#000;font-size:.8rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:1rem;border-radius:14px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,200,66,.3)}
        .btn-secondary{display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.06);color:#fff;font-size:.75rem;font-weight:600;padding:.85rem;border-radius:14px;text-decoration:none;border:1px solid var(--bd);transition:border-color .3s}
        .btn-secondary:hover{border-color:rgba(255,255,255,.2)}

        .cta-box{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:32px 24px;text-align:center}
        .cta-box h3{font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:8px}
        .cta-box p{font-size:.82rem;color:var(--wm);margin-bottom:20px;line-height:1.5}

        footer{border-top:1px solid var(--bd);padding:28px 40px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:40px}
        .f-links{display:flex;gap:24px;flex-wrap:wrap}
        .f-links a{font-family:var(--mono);font-size:.58rem;letter-spacing:.1em;color:rgba(255,255,255,.18);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .f-links a:hover{color:var(--wm)}
        .f-copy{font-family:var(--mono);font-size:.52rem;color:rgba(255,255,255,.1)}

        .state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:14px;text-align:center;padding:40px}
        .state-icon{font-size:3rem}
        .state-title{font-size:1.5rem;font-weight:800;color:#fff}
        .state-sub{font-size:.9rem;color:var(--wm)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .7s ease forwards}
        .fu2{animation:fadeUp .7s .1s ease both}
        .fu3{animation:fadeUp .7s .2s ease both}

        @media(max-width:640px){
          .nav{padding:0 20px}
          .wrap{padding:24px 20px 80px}
          footer{padding:24px 20px}
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
          <div className="state-title">Loading event…</div>
        </div>
      )}

      {!loading && notFound && (
        <div className="state">
          <div className="state-icon">📅</div>
          <div className="state-title">Event not found</div>
          <div className="state-sub">This event may have ended or been removed.</div>
          <Link href="/" className="nav-dl" style={{ marginTop: 20 }}>Browse CaliSpot</Link>
        </div>
      )}

      {!loading && event && (
        <div className="wrap">

          {/* Banner image — tap to fullscreen */}
          {event.image_url && (
            <div className="hero-img-wrap fu" onClick={() => setFullscreenImg(true)}>
              <img src={event.image_url} alt={event.title} />
            </div>
          )}

          {/* Date block */}
          <div className="date-block fu">
            <div className="date-box">
              <div className="date-day">{fmtDay(event.event_date)}</div>
              <div className="date-mon">{fmtMonth(event.event_date)}</div>
            </div>
            <div className="date-info">
              <div className="date-full">{fmtDate(event.event_date)}</div>
              <div className="date-time">{fmtTime(event.event_date)}</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="event-title fu2">{event.title}</h1>

          {/* Badges */}
          <div className="badges fu2">
            {event.is_free ? (
              <span className="badge free">✓ Free</span>
            ) : event.price ? (
              <span className="badge paid">£{Math.round(event.price)}</span>
            ) : (
              <span className="badge paid">Paid</span>
            )}
            {goingCount > 0 && (
              <span className="badge going">👥 {goingCount} going</span>
            )}
          </div>

          {/* Meta */}
          <div className="meta fu2">
            {(event.location_name || event.spot_name) && (
              <div className="meta-row">
                <span className="meta-icon">📍</span>
                {event.location_name || event.spot_name}
              </div>
            )}
            {event.organiser_name && (
              <div className="meta-row">
                <span className="meta-icon">👤</span>
                Organised by {event.organiser_name}
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="desc fu3">{event.description}</p>
          )}

          {/* Spot link */}
          {event.spot_slug && (
            <Link href={`/s/${event.spot_slug}`} className="spot-link fu3">
              <div className="spot-icon">
                <img src="/images/calilogobg.png" alt="" />
              </div>
              <div className="spot-text">
                <div className="spot-name">{event.spot_name || "View Spot"}</div>
                <div className="spot-sub">View spot details · equipment · photos</div>
              </div>
              <span className="spot-arrow">→</span>
            </Link>
          )}

          {/* Map */}
          {spotCoords && (
            <div className="map-wrap fu3">
              <iframe
                title={event.spot_name || "Event location"}
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
var map=L.map('m',{zoomControl:true,attributionControl:false}).setView([${spotCoords.lat},${spotCoords.lng}],15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var icon=L.divIcon({className:'',html:'<div style="width:16px;height:16px;background:#F5C842;border:2px solid #0a0a0a;border-radius:50%;box-shadow:0 0 8px rgba(245,200,66,.4)"></div>',iconSize:[16,16],iconAnchor:[8,8]});
L.marker([${spotCoords.lat},${spotCoords.lng}],{icon:icon}).addTo(map).bindPopup('<b>${(spotCoords.name || "").replace(/'/g, "\\\\'")}</b>');
<\/script>
</body></html>`}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="actions fu3">
            <a href={`calispot://event/${event.id}`} className="btn-primary">
              Open in CaliSpot
            </a>
            {event.join_url && (
              <a href={event.join_url} className="btn-secondary" target="_blank" rel="noreferrer">
                Join / Sign Up ↗
              </a>
            )}
          </div>

          {/* Download CTA */}
          <div className="cta-box fu3">
            <h3>RSVP in the app</h3>
            <p>Mark &ldquo;I&apos;m going&rdquo;, see who else is attending, and get notified about events at your favourite spots.</p>
            <a href={APP_STORE} className="btn-primary" target="_blank" rel="noreferrer">
              Download CaliSpot — Free
            </a>
          </div>

        </div>
      )}

      {/* Fullscreen image overlay */}
      {fullscreenImg && event?.image_url && (
        <div className="img-overlay" onClick={() => setFullscreenImg(false)}>
          <button className="img-overlay-close" onClick={e => { e.stopPropagation(); setFullscreenImg(false); }}>✕</button>
          <img src={event.image_url} alt={event.title} onClick={e => e.stopPropagation()} />
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