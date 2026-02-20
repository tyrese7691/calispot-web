import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
/* ---------------- ICON SIZING ---------------- */
const responsiveIconSize = {
  width: "8vw",
  height: "8vw",
  minWidth: "60px",
  minHeight: "60px",
  maxWidth: "90px",
  maxHeight: "90px",
  objectFit: "contain",
};

/* ---------------- RATING ICON ---------------- */
const RatingIcon = ({ icon, rating }) => (
  <div style={{ textAlign: "center" }}>
    <img src={icon} alt="" style={responsiveIconSize} />
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "4px",
        marginTop: "6px",
      }}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: i < rating ? "#FFD700" : "#555",
          }}
        />
      ))}
    </div>
  </div>
);

export default function SpotDetail() {

const [L, setL] = useState(null);

  const router = useRouter();
  const { slug } = router.query;
  const [spots, setSpots] = useState([]);
  const [spot, setSpot] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

useEffect(() => {
  import("leaflet").then((leaflet) => {
    delete leaflet.Icon.Default.prototype._getIconUrl;
    setL(leaflet);
  });
}, []);

  useEffect(() => {
    fetch(
      "https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/spots/spots.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setSpots(data);
        const found = data.find((s) => s.slug === slug);
        if (found) setSpot(found);
      })
      .catch((err) => console.error("Error fetching spots:", err));
  }, [slug]);

if (!spot || !L) return null;


  /* ---------------- MAP MARKER ---------------- */
  const logoMarker = new L.Icon({
    iconUrl: "/images/Calilogobg.png",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -36],
  });

  const iconMap = {
    abs: "/images/absyes.png",
    dipBars: "/images/dipyes.png",
    lowBars: "/images/lowbaryes.png",
    monkeyBars: "/images/monkeybarsyes.png",
    pullUpBars: "/images/pullupyes.png",
    train: "/images/Train.png",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #eaeaea 100%)",
    color: "#000",
    padding: "0.6rem 1.5rem",
    borderRadius: "14px",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };

  return (
    <div
      style={{
        background: "radial-gradient(1200px at top, #2a2a2a 0%, #121212 60%)",
        color: "#fff",
        minHeight: "100vh",
        padding: "1.5rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* ---------------- TOP BAR ---------------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <button
          style={buttonStyle}
          onClick={() => router.push("/")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
          }}
        >
          Back
        </button>

        <a
          href="https://apps.apple.com/gb/app/calispot/id6747050360"
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
          }}
        >
          Download the App
        </a>
      </div>

      {/* ---------------- TITLE ---------------- */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
        }}
      >
        {spot.name}
      </h1>

      {/* ---------------- IMAGE GALLERY FRAME ---------------- */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 3rem",
          padding: "1.5rem 1.5rem 1.5rem",
          borderRadius: "20px",
          background: "rgba(30,30,30,0.85)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "visible",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            paddingTop: "20px",
            paddingBottom: "0.5rem",
            overflowX: "auto",
            overflowY: "visible",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {spot.images.map((img, i) => (
            <div
              key={i}
              style={{
                scrollSnapAlign: "center",
                flexShrink: 0,
                width: "280px",
                height: "160px",
                position: "relative",
              }}
            >
              <img
                src={`https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/images/${img}`}
                alt=""
                onClick={() => setActiveImage(i)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transformOrigin: "center center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08) translateY(-6px)";
                  e.currentTarget.style.zIndex = 10;
                  e.currentTarget.style.boxShadow =
                    "0 30px 80px rgba(0,0,0,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.zIndex = 1;
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0,0,0,0.45)";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- FULLSCREEN IMAGE ---------------- */}
      {activeImage !== null && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={`https://nrfwyewylurdmsnxycwz.supabase.co/storage/v1/object/public/images/${spot.images[activeImage]}`}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "16px",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* ---------------- QUALITY & VARIETY ---------------- */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 2.5rem",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          {["Quality", "Variety"].map((type) => (
            <div
              key={type}
              style={{
                flex: 1,
                background: "linear-gradient(145deg, #222222 0%, #1a1a1a 100%)",
                padding: "2rem",
                borderRadius: "22px",
                boxShadow: "0 25px 70px rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 35px 85px rgba(0,0,0,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 25px 70px rgba(0,0,0,0.55)";
              }}
            >
              <RatingIcon
                icon={`/images/${type}.png`}
                rating={
                  type === "Quality"
                    ? spot.equipmentQualityRating
                    : spot.equipmentVarietyRating
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- EQUIPMENT ---------------- */}
      {spot.equipment?.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 2rem",
            padding: "0 1.5rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "linear-gradient(145deg, #222222 0%, #1a1a1a 100%)",
              padding: "2rem",
              borderRadius: "22px",
              boxShadow: "0 25px 70px rgba(0,0,0,0.55)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              overflowX: "auto",
              flexWrap: "nowrap",
              minWidth: 0,
              boxSizing: "border-box",
              cursor: "default",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 35px 85px rgba(0,0,0,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 25px 70px rgba(0,0,0,0.55)";
            }}
          >
            {spot.equipment.map(
              (eq) =>
                iconMap[eq] && (
                  <img
                    key={eq}
                    src={iconMap[eq]}
                    alt=""
                    style={{
                      height: "60px",
                      width: "auto",
                      flexShrink: 0,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )
            )}
          </div>
        </div>
      )}

      {/* ---------------- NEAREST STATION ---------------- */}
      {spot.nearestTrainStation && (
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto 2rem",
            padding: "0 1.5rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "linear-gradient(145deg, #222222 0%, #1a1a1a 100%)",
              padding: "2rem",
              borderRadius: "22px",
              boxShadow: "0 25px 70px rgba(0,0,0,0.55)",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "1rem",
              minWidth: 0,
              boxSizing: "border-box",
              cursor: "default",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 35px 85px rgba(0,0,0,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 25px 70px rgba(0,0,0,0.55)";
            }}
          >
            <img
              src={iconMap.train}
              alt=""
              style={{ ...responsiveIconSize, flexShrink: 0 }}
            />
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
              {spot.nearestTrainStation}
            </span>
          </div>
        </div>
      )}

      {/* ---------------- MAP ---------------- */}
      <div
        style={{
          height: "300px",
          borderRadius: "18px",
          overflow: "hidden",
          marginBottom: "3rem",
          boxShadow: "0 25px 70px rgba(0,0,0,0.55)",
        }}
      >
        <MapContainer
          center={[spot.lat, spot.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap & CARTO"
          />
          <Marker position={[spot.lat, spot.lng]} icon={logoMarker}>
            <Popup>{spot.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* ---------------- FINAL CTA ---------------- */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 5rem",
          padding: "3rem 2rem",
          borderRadius: "22px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, #FFD500 0%, #FFC400 50%, #FFB300 100%)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.55)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            color: "#121212",
          }}
        >
          Train smarter. Find your next spot.
        </h2>
        <p
          style={{ color: "#121212", marginBottom: "2rem", fontSize: "1.1rem" }}
        >
          Download the free CaliSpot app and never miss your ideal outdoor
          workout.
        </p>
        <a
          href="https://apps.apple.com/gb/app/calispot/id6747050360"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#121212",
            color: "#FFD500",
            padding: "0.75rem 1.5rem",
            borderRadius: "16px",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
          }}
        >
          Download the App
        </a>
      </div>
    </div>
  );
}