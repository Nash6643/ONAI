import {
    forwardRef,
    useImperativeHandle,
    useRef,
  } from "react";
  import Webcam from "react-webcam";
  
  export interface CameraHandle {
    captureImage: () => string | null;
  }
  
  const CameraPanel = forwardRef<CameraHandle>((_, ref) => {
    const webcamRef = useRef<Webcam>(null);
  
    useImperativeHandle(ref, () => ({
      captureImage() {
        return webcamRef.current?.getScreenshot() ?? null;
      },
    }));
  
    return (
      <div
        style={{
          flex: 1,
          background: "#1f2937",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "16px",
          }}
        >
          📷 Live Camera
        </h2>
  
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",
          }}
          style={{
            width: "100%",
            borderRadius: "12px",
            flex: 1,
            objectFit: "cover",
          }}
        />
      </div>
    );
  });
  
  CameraPanel.displayName = "CameraPanel";
  
  export default CameraPanel;