// pages/app-ads.txt.js
// Authorised sellers file for AdMob (IAB app-ads.txt spec).
//
// Served from a route rather than public/ deliberately: a static file in
// public/ is cached at the CDN edge, and the 404s served before the file
// existed got cached too — so some edges (and Google's crawler) kept seeing
// an empty response long after the file was deployed. Rendering it here with
// an explicit short Cache-Control sidesteps that entirely.
//
// NOTE: public/app-ads.txt must NOT exist — files in public/ take precedence
// over routes in Next.js and would shadow this.

const SELLERS = [
  // AdMob publisher ID — AdMob → Settings → Account information
  "google.com, pub-4295610989502713, DIRECT, f08c47fec0942fa0",
];

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  // Short cache so a change propagates in minutes, not days.
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60");
  res.write(SELLERS.join("\n") + "\n");
  res.end();
  return { props: {} };
}

export default function AppAds() { return null; }
