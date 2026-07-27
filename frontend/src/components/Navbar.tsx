import { useEffect, useState } from "react";
import { api } from "../services/vision";

export default function Navbar() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await api.get("/health");

        setOnline(response.data.status === "online");
      } catch {
        setOnline(false);
      }
    }

    checkBackend();
  }, []);

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
      <h2>🤖 ONAI</h2>

      <div
        style={{
          color: online ? "#22c55e" : "#ef4444",
          fontWeight: "bold",
        }}
      >
        {online ? "🟢 Backend Online" : "🔴 Backend Offline"}
      </div>
    </nav>
  );
}