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
        }}
      >
        {/* Demo detection box */}
        <div
          style={{
            position: "absolute",
  
            left: "35%",
            top: "30%",
  
            width: "180px",
            height: "120px",
  
            border: "3px solid #22c55e",
            borderRadius: "12px",
          }}
        />
  
        {/* Demo label */}
        <div
          style={{
            position: "absolute",
  
            left: "35%",
            top: "calc(30% - 30px)",
  
            background: "#22c55e",
  
            color: "white",
  
            padding: "4px 10px",
  
            borderRadius: "8px",
  
            fontWeight: "bold",
          }}
        >
          Demo Object
        </div>
      </div>
    );
  }