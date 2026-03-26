// pages/spots/[city].js
// SEO page: "Calisthenics Parks in [City]" / "Best Outdoor Gyms in [City]"
// Generates pages like /spots/london, /spots/manchester, etc.

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

// Cities we generate pages for — expand as needed
const CITY_DATA = {
  london:      { name: "London",      lat: 51.505, lng: -0.09, radius: 0.4 },
  manchester:  { name: "Manchester",  lat: 53.483, lng: -2.244, radius: 0.3 },
  birmingham:  { name: "Birmingham",  lat: 52.486, lng: -1.890, radius: 0.3 },
  leeds:       { name: "Leeds",       lat: 53.801, lng: -1.549, radius: 0.3 },
  bristol:     { name: "Bristol",     lat: 51.455, lng: -2.588, radius: 0.3 },
  liverpool:   { name: "Liverpool",   lat: 53.408, lng: -2.992, radius: 0.3 },
  brighton:    { name: "Brighton",    lat: 50.827, lng: -0.152, radius: 0.3 },
  edinburgh:   { name: "Edinburgh",   lat: 55.953, lng: -3.189, radius: 0.3 },
  glasgow:     { name: "Glasgow",     lat: 55.864, lng: -4.252, radius: 0.3 },
  cardiff:     { name: "Cardiff",     lat: 51.482, lng: -3.179, radius: 0.3 },
  nottingham:  { name: "Nottingham",  lat: 52.954, lng: -1.158, radius: 0.3 },
  sheffield:   { name: "Sheffield",   lat: 53.383, lng: -1.465, radius: 0.3 },
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(CITY_DATA).map(city => ({ params: { city } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const city = params.city?.toLowerCase();
  const data = CITY_DATA[city];
  if (!data) return { notFound: true };

  // Fetch spots at build time
  let spots = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/spots/spots.json`);
    const all = await res.json();
    // Filter spots within rough radius of city center
    spots = all.filter(s => {
      if (!s.lat || !s.lng) return false;
      const dist = Math.sqrt(Math.pow(s.lat - data.lat, 2) + Math.pow(s.lng - data.lng, 2));
      return dist <= data.radius;
    });
  } catch {}

  return {
    props: { cityKey: city, cityName: data.name, spots },
    revalidate: 3600, // Rebuild hourly
  };
}

export default function CityPage({ cityKey, cityName, spots }) {
  const cd = CITY_DATA[cityKey];

  const title = `Calisthenics Parks in ${cityName} — Outdoor Gym Spots | CaliSpot`;
  const desc = `Find the best outdoor calisthenics parks and workout spots in ${cityName}. ${spots.length} spots with pull-up bars, dip stations, and more. Free on CaliSpot.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.calispot.xyz/spots/${cityKey}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://www.calispot.xyz/spots/${cityKey}`} />
        <link rel="icon" href="/images/calilogobg.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href={FONTS} rel="stylesheet" />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--y:#F5C842;--g:#3DFF8F;--bg:#0a0a0a;--bg2:#111;--card:#141414;--bd:rgba(255,255,255,.07);--w:rgba(255,255,255,.92);--wm:rgba(255,255,255,.4);--font:'Bricolage Grotesque',sans-serif;--mono:'DM Mono',monospace}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:var(--font);overflow-x:hidden;min-height:100vh}

        .nav{position:sticky;top:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;background:rgba(10,10,10,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--bd)}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nav-logo img{width:51px;height:51px;border-radius:50%}
        .nav-logo span{font-size:1rem;font-weight:800;letter-spacing:-.02em;color:var(--w)}
        .nav-dl{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0a0a0a;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.55rem 1.3rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nav-dl:hover{transform:scale(1.04);box-shadow:0 0 24px rgba(245,200,66,.45)}

        .wrap{max-width:900px;margin:0 auto;padding:80px 48px 100px}

        .eyb{font-family:var(--mono);font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:16px;display:flex;align-items:center;gap:10px}
        .eyb::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}

        h1{font-size:clamp(2.4rem,6vw,4.5rem);font-weight:900;line-height:.92;letter-spacing:-.04em;color:#fff;margin-bottom:16px}
        .sub{font-size:1rem;color:var(--wm);line-height:1.7;max-width:560px;margin-bottom:40px}

        .map-wrap{width:100%;height:clamp(280px,40vh,420px);border-radius:20px;overflow:hidden;border:1px solid var(--bd);margin-bottom:40px;background:var(--bg2)}

        .spot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:48px}
        .spot-card{background:var(--bg2);border:1px solid var(--bd);border-radius:18px;overflow:hidden;transition:border-color .3s,transform .3s;text-decoration:none;display:block}
        .spot-card:hover{border-color:rgba(245,200,66,.3);transform:translateY(-3px)}
        .spot-card-img{width:100%;height:140px;object-fit:cover;display:block;background:#1a1a1a}
        .spot-card-body{padding:14px}
        .spot-card-name{font-size:.95rem;font-weight:800;color:#fff;margin-bottom:4px}
        .spot-card-loc{font-family:var(--mono);font-size:.52rem;letter-spacing:.1em;text-transform:uppercase;color:var(--wm);margin-bottom:8px}
        .spot-card-eq{display:flex;gap:5px;flex-wrap:wrap}
        .spot-card-eq span{font-family:var(--mono);font-size:.46rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 7px;border-radius:20px;background:rgba(255,255,255,.05);color:var(--wm);border:1px solid var(--bd)}

        .seo-content{margin-bottom:48px}
        .seo-content h2{font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:12px}
        .seo-content p{font-size:.92rem;color:rgba(255,255,255,.5);line-height:1.8;margin-bottom:16px}
        .seo-content ul{list-style:none;padding:0;margin-bottom:16px}
        .seo-content li{font-size:.88rem;color:rgba(255,255,255,.5);line-height:1.8;padding-left:16px;position:relative}
        .seo-content li::before{content:'·';position:absolute;left:0;color:var(--y);font-weight:900}

        .cta{background:var(--y);border-radius:24px;padding:48px;text-align:center}
        .cta h2{font-size:clamp(1.8rem,5vw,3rem);font-weight:900;letter-spacing:-.04em;color:#0a0a0a;margin-bottom:12px;line-height:.95}
        .cta p{font-size:.88rem;color:rgba(0,0,0,.5);margin-bottom:24px;max-width:340px;margin-left:auto;margin-right:auto}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;background:#0a0a0a;color:var(--y);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 2rem;border-radius:50px;text-decoration:none;transition:transform .2s}
        .cta-btn:hover{transform:translateY(-2px)}

        .back{margin-top:40px;padding-top:24px;border-top:1px solid var(--bd)}
        .back a{display:inline-flex;align-items:center;gap:6px;color:var(--y);font-family:var(--mono);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:opacity .2s}
        .back a:hover{opacity:.7}

        footer{border-top:1px solid var(--bd);padding:28px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .f-links{display:flex;gap:2rem;flex-wrap:wrap}
        .f-links a{font-family:var(--mono);font-size:.58rem;letter-spacing:.1em;color:rgba(255,255,255,.18);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .f-links a:hover{color:var(--wm)}
        .f-copy{font-family:var(--mono);font-size:.52rem;color:rgba(255,255,255,.1)}

        @media(max-width:768px){
          .nav,.wrap,footer{padding-left:20px;padding-right:20px}
          .spot-grid{grid-template-columns:1fr}
          .cta{padding:32px 20px}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/images/calilogobg.png" alt="CaliSpot" />
        </Link>
        <a href={APP_STORE} className="nav-dl" target="_blank" rel="noreferrer">Download on iOS</a>
      </nav>

      <div className="wrap">
        <div className="eyb">{cityName}</div>
        <h1>Calisthenics Parks in {cityName}</h1>
        <p className="sub">
          {spots.length > 0
            ? `${spots.length} outdoor calisthenics ${spots.length === 1 ? "spot" : "spots"} in ${cityName} with pull-up bars, dip stations, and more. All free to use.`
            : `We're expanding to ${cityName} soon. Download CaliSpot to be the first to discover spots here.`}
        </p>

        {/* Map */}
        <div className="map-wrap">
          {spots.filter(s => s.lat && s.lng).length > 0 ? (
            <iframe
              title={`Spots in ${cityName}`}
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
var spots=${JSON.stringify(spots.filter(s=>s.lat&&s.lng).map(s=>({lat:s.lat,lng:s.lng,name:s.name,slug:s.slug,station:s.nearestTrainStation||""})))};
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
else map.setView([${cd.lat},${cd.lng}],12);
<\/script>
</body></html>`}
            />
          ) : cd ? (
            <iframe
              title={cityName}
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
var map=L.map('m',{zoomControl:true,attributionControl:false}).setView([${cd.lat},${cd.lng}],12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
<\/script>
</body></html>`}
            />
          ) : null}
        </div>

        {/* Spot grid */}
        {spots.length > 0 && (
          <div className="spot-grid">
            {spots.map(s => (
              <Link href={`/s/${s.slug}`} key={s.slug} className="spot-card">
                {s.images?.[0] ? (
                  <img className="spot-card-img" src={`${IMG_BASE}${s.images[0]}`} alt={s.name} loading="lazy" />
                ) : (
                  <div className="spot-card-img" />
                )}
                <div className="spot-card-body">
                  <div className="spot-card-name">{s.name}</div>
                  {s.nearestTrainStation && <div className="spot-card-loc">📍 {s.nearestTrainStation}</div>}
                  <div className="spot-card-eq">
                    {(s.equipment || []).slice(0, 4).map(eq => (
                      <span key={eq}>{EQ_LABELS[eq] || eq}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* SEO content */}
        <article className="seo-content">
          <h2>Best Outdoor Gyms in {cityName}</h2>
          <p>
            Looking for free outdoor workout spots in {cityName}? CaliSpot maps every
            calisthenics park and outdoor gym in the area so you can find the best
            places to train — whether you&apos;re into pull-ups, muscle-ups, dips, or
            bodyweight fitness in general.
          </p>
          <p>
            Each spot on CaliSpot includes equipment details, quality and variety
            ratings, photos from the community, and directions from the nearest
            station. All spots are free to use and open to the public.
          </p>

          <h2>What Equipment Can You Find?</h2>
          <ul>
            <li>Pull-up bars at various heights</li>
            <li>Parallel dip bars</li>
            <li>Low bars for rows and front levers</li>
            <li>Monkey bars for grip and shoulder work</li>
            <li>Abs stations and benches</li>
          </ul>

          <h2>Get the Full Experience</h2>
          <p>
            Download CaliSpot on iOS to check in at spots, log your training
            sessions, see who&apos;s training nearby, and join local events.
            Android is coming soon — sign up for the waitlist on the{" "}
            <Link href="/" style={{ color: "#F5C842", textDecoration: "underline" }}>homepage</Link>.
          </p>
        </article>

        {/* CTA */}
        <div className="cta">
          <h2>Start Training in {cityName}</h2>
          <p>Find every spot, check in, and join the community.</p>
          <a href={APP_STORE} className="cta-btn" target="_blank" rel="noreferrer">Download CaliSpot</a>
        </div>

        <div className="back">
          <Link href="/">← Back to all spots</Link>
        </div>
      </div>

      {/* FOOTER */}
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