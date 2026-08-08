// pages/sitemap.xml.js
// Server-rendered sitemap: static pages + city SEO pages + every spot page.
// Submit https://www.calispot.xyz/sitemap.xml in Google Search Console.

const SUPABASE_URL = "https://nrfwyewylurdmsnxycwz.supabase.co";
const BASE = "https://www.calispot.xyz";

const CITIES = [
  "london", "manchester", "birmingham", "leeds", "bristol", "liverpool",
  "brighton", "edinburgh", "glasgow", "cardiff", "nottingham", "sheffield",
];

const STATIC_PAGES = ["", "/privacy", "/terms"];

function url(loc, priority = "0.7", changefreq = "weekly") {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function getServerSideProps({ res }) {
  let spots = [];
  try {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/public/spots/spots.json`);
    spots = await r.json();
  } catch {}

  const entries = [
    ...STATIC_PAGES.map(p => url(`${BASE}${p}`, p === "" ? "1.0" : "0.3", "weekly")),
    ...CITIES.map(c => url(`${BASE}/spots/${c}`, c === "london" ? "0.9" : "0.6", "daily")),
    ...spots
      .filter(s => s.slug)
      .map(s => url(`${BASE}/s/${encodeURIComponent(s.slug)}`, "0.7", "weekly")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
