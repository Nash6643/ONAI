import { useRef } from "react";
import Webcam from "react-webcam";

export default function CameraPanel() {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    console.log(imageSrc);

    if (imageSrc) {
      alert("Frame captured! Check the browser console.");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        background: "#1f2937",
        borderRadius: "15px",
        padding: "20px",
        color: "white",
      }}
    >
      <h2>📷 Live Camera</h2>

      <div
        style={{
          marginTop: "20px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          style={{
            width: "100%",
            borderRadius: "12px",
          }}
        />
      </div>

      <button
        onClick={capture}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          cursor: "pointer",
        }}
      >
        📸 Capture Frame
      </button>
    </div>
  );
}