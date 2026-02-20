import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet (no SSR)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

export default function Home() {
  const [L, setL] = useState(null);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      delete leaflet.Icon.Default.prototype._getIconUrl;
      setL(leaflet);
    });
  }, []);

  useEffect(() => {
    fetch("https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/spots/spots.json")
      .then((res) => res.json())
      .then((data) => setSpots(data))
      .catch((err) => console.error("Error fetching spots:", err));
  }, []);

  if (!L) return null;

  const logoMarker = new L.Icon({
    iconUrl: "/images/Calilogobg.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  const buttonStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #eaeaea 100%)",
    color: "#000",
    padding: "0.6rem 1.2rem",
    borderRadius: "14px",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };

  const hoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
  };

  return (
    <div
      style={{
        background: "radial-gradient(1200px at top, #2a2a2a 0%, #121212 60%)",
        color: "#fff",
        minHeight: "100vh",
        padding: "1.5rem",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <img src="/images/Calilogobg.png" alt="CaliSpot" style={{ height: "60px" }} />
        <a
          href="https://apps.apple.com/gb/app/calispot/id6747050360"
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
          }}
        >
          Download the App
        </a>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "900px", margin: "0 auto 3.5rem", textAlign: "center", animation: "fadeUp 0.7s ease forwards" }}>
        <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
          Train anywhere.
          <br />
          Know exactly what you’re walking into.
        </h1>
        <p style={{ lineHeight: "1.7", color: "#ccc", fontSize: "1.05rem" }}>
          CaliSpot helps you find real outdoor calisthenics parks in London -
          with proper equipment, real photos, and an interactive map so you never waste a session.
        </p>
      </div>

      {/* Map Hero */}
      <div style={{ height: "420px", marginBottom: "3.5rem", borderRadius: "22px", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        <MapContainer center={[51.5, -0.1]} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap & CARTO"
          />
          {spots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={logoMarker}>
              <Popup>
                <Link href={`/spots/${spot.slug}`} style={{ textDecoration: "underline", color: "#000", fontWeight: 600 }}>
                  {spot.name}
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Features */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 4rem", padding: "2.5rem", background: "linear-gradient(180deg, #1f1f1f 0%, #141414 100%)", borderRadius: "22px", boxShadow: "0 25px 70px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>Why CaliSpot?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {[
            ["Real outdoor parks", "Only verified calisthenics equipment — no gyms, no filler."],
            ["Equipment photos", "See bars, layouts, and setups before you go."],
            ["Interactive map", "Explore London visually and plan sessions fast."],
            ["Nearby transport", "Quick access to stations and routes."],
            ["Save favourites", "Instant access to the spots you train at most."],
            ["Built for calisthenics", "Purpose-built for bodyweight training."],
          ].map(([title, desc], i) => (
            <div
              key={i}
              style={{ padding: "1.5rem", borderRadius: "18px", background: "linear-gradient(145deg, #222222 0%, #1a1a1a 100%)", boxShadow: "0 20px 50px rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.05)", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "default" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 30px 65px rgba(0,0,0,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.55)"; }}
            >
              <h4 style={{ marginBottom: "0.5rem" }}>{title}</h4>
              <p style={{ margin: 0, color: "#ccc", lineHeight: "1.5" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 4rem", padding: "2.5rem", background: "linear-gradient(180deg, #1f1f1f 0%, #141414 100%)", borderRadius: "22px", boxShadow: "0 25px 70px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>Frequently Asked Questions</h3>
        {[
          { q: "How do I save a spot to my favourites?", a: "Tap the heart icon on any spot page in the CaliSpot iOS app. Your favourites are instantly accessible from your profile." },
          { q: "Can I suggest a new park?", a: "Yes! Use the 'Suggest Spot' feature in the app to submit new parks, and our team will review them for accuracy." },
          { q: "Is CaliSpot free?", a: "Absolutely. The app is fully free to explore, save spots, and see maps — you only need an iOS device." },
          { q: "Can I see who is training at a spot?", a: "You can see recent activity in the app with our 'Who’s Here?' feature, giving you a sense of real-time usage." },
          { q: "Can I filter spots by equipment type?", a: "Yes, use the filters in the app to view only the parks with the equipment you want to train on." },
          { q: "How often is the park data updated?", a: "We regularly update photos, maps, and spot info to ensure accuracy and keep up with changes." },
          { q: "Can I share a spot with friends?", a: "Yes! Tap the share icon on any spot page to send a link via social media, message, or email." },
        ].map(({ q, a }, i) => (
          <details
            key={i}
            style={{ marginBottom: "1rem", borderRadius: "16px", background: "linear-gradient(145deg, #222222 0%, #1a1a1a 100%)", boxShadow: "0 18px 45px rgba(0,0,0,0.45)", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 30px 65px rgba(0,0,0,0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 18px 45px rgba(0,0,0,0.45)"; }}
          >
            <summary style={{ fontWeight: 600, fontSize: "1.05rem", color: "#fff", outline: "none", padding: "1.25rem", borderRadius: "16px", display: "block", margin: 0 }}>
              {q}
            </summary>
            <p style={{ padding: "0 1.25rem 1.25rem 1.25rem", margin: 0, color: "#ccc", lineHeight: "1.5" }}>{a}</p>
          </details>
        ))}
      </div>

      {/* Final CTA */}
      <div style={{ maxWidth: "900px", margin: "0 auto 5rem", padding: "3rem 2rem", borderRadius: "22px", textAlign: "center", background: "linear-gradient(135deg, #FFD500 0%, #FFC400 50%, #FFB300 100%)", boxShadow: "0 25px 70px rgba(0,0,0,0.55)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#121212" }}>
          Train smarter. Find your next spot.
        </h2>
        <p style={{ color: "#121212", marginBottom: "2rem", fontSize: "1.1rem" }}>
          Download the free CaliSpot app and never miss your ideal outdoor workout.
        </p>
        <a
          href="https://apps.apple.com/gb/app/calispot/id6747050360"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#121212", color: "#FFD500", padding: "0.75rem 1.5rem", borderRadius: "16px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)"; }}
        >
          Download the App
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginBottom: "2rem" }}>
        <Link href="/privacy" style={{ color: "#888" }}>Privacy Policy</Link>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}