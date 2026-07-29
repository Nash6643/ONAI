interface VisionOverlayProps {
    visible?: boolean;
  }
  
  export default function VisionOverlay({
    visible = true,
  }: VisionOverlayProps) {
    if (!visible) {
      return null;
    }
  
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Dynamic inline stylesheet for keyframe animation */}
        <style>{`
          @keyframes scanAnimation {
            0% {
              top: 0%;
              opacity: 0.4;
            }
            50% {
              opacity: 0.9;
            }
            100% {
              top: 100%;
              opacity: 0.4;
            }
          }
        `}</style>
  
        {/* Blue Scanning Line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, #3b82f6, #60a5fa, #3b82f6, transparent)",
            boxShadow: "0 0 15px 4px rgba(59, 130, 246, 0.7)",
            animation: "scanAnimation 2.5s ease-in-out infinite alternate",
          }}
        />
  
        {/* Subtle Blue Glow Framing */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.15)",
          }}
        />
      </div>
    );
  }