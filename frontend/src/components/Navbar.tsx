export default function Navbar() {
    return (
      <nav
        style={{
          height: "70px",
          background: "#111827",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
        }}
      >
        <h2>ONAI</h2>
  
        <div style={{ color: "#22c55e" }}>
          ● Backend Offline
        </div>
      </nav>
    );
  }