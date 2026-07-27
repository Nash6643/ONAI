import Navbar from "../components/Navbar";
import CameraPanel from "../components/camera/CameraPanel";
import ChatPanel from "../components/chat/ChatPanel";

export default function Home() {
  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <CameraPanel />

        <ChatPanel />
      </div>
    </div>
  );
}