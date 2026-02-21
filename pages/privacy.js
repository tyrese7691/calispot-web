import Link from "next/link";

export default function Privacy() {
  return (
    <div
      style={{
        backgroundColor: "#1c1c1c",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header with logo */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="/images/calilogobg.png" alt="CaliSpot" style={{ height: "60px" }} />
      </div>

      {/* Title */}
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Privacy Policy</h1>

      {/* Privacy content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.6", fontSize: "1rem" }}>
        <p>Last updated: February 2026</p>
        <p>
          CaliSpot values your privacy. This website does not collect any personal information.
        </p>
        <p>
          The iOS app may collect limited data to provide features like saving favorites,
          tracking workouts, and seeing who’s training at each spot.
        </p>
        <p>By using this website, you agree to this privacy policy.</p>
        <p>If you have any questions, please contact us at: <a href="mailto:8mindltd@gmail.com" style={{ color: "#fff", textDecoration: "underline" }}>8mindltd@gmail.com</a></p>
      </div>

      {/* Back to spots button */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link
          href="/"
          style={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "0.5rem 1rem",
            borderRadius: "12px",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "1rem",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e0e0e0";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Back
        </Link>
      </div>
    </div>
  );
}
