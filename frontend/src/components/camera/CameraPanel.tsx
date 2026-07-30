import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import Webcam from "react-webcam";

import { useVisionSettings } from "../../context/VisionSettingsContext";
import { useVision } from "../../context/VisionContext";

import VisionOverlay from "../../components/VisionOverlay";

import styles from "./CameraPanel.module.css";

export interface CameraHandle {
  captureImage: () => Promise<string | null>;
  startLiveCapture: () => void;
  stopLiveCapture: () => void;
}

const CameraPanel = forwardRef<CameraHandle>((_, ref) => {
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<number | null>(null);

  const { setLatestFrame } = useVision();

  const [boxPosition] = useState({
    x: 50,
    y: 50,
  });

  const { mode, setMode } = useVisionSettings();

  async function cropToFocus(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        const width = image.width;
        const height = image.height;

        const cropWidth = width * 0.42;
        const cropHeight = height * 0.58;

        const x = (width - cropWidth) / 2;
        const y = (height - cropHeight) / 2;

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Canvas error");
          return;
        }

        ctx.drawImage(
          image,
          x,
          y,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };

      image.src = imageSrc;
    });
  }

  useImperativeHandle(ref, () => ({
    async captureImage() {
      const image = webcamRef.current?.getScreenshot();
    
      console.log("================================");
      console.log("Capture Time:", new Date().toLocaleTimeString());
      console.log("Image Length:", image?.length);
      console.log("Image Preview:", image?.substring(0, 100));
      console.log("================================");
    
      if (!image) return null;
    
      if (mode === "scene") {
        return image;
      }
    
      return await cropToFocus(image);
    },

    startLiveCapture() {
      if (intervalRef.current) return;

      intervalRef.current = window.setInterval(() => {
        const frame = webcamRef.current?.getScreenshot();

        if (frame) {
          setLatestFrame(frame);
        }
      }, 1000);
    },

    stopLiveCapture() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  }));

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.cameraPanel}>
      <div className={styles.header}>
        <div className={styles.title}>📷 Live Vision</div>

        <div className={styles.live}>
          <div className={styles.dot}></div>
          AI Vision Ready
        </div>
      </div>

      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className={styles.video}
            mirrored
          />

          {/* NEW: Overlay Layer */}
          <VisionOverlay />

          {mode === "focus" && (
            <div
              className={styles.scanBox}
              style={{
                left: `${boxPosition.x}%`,
                top: `${boxPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className={styles.scanLabel}>
                Focus Area
              </div>

              <div className={`${styles.corner} ${styles.topLeft}`} />
              <div className={`${styles.corner} ${styles.topRight}`} />
              <div className={`${styles.corner} ${styles.bottomLeft}`} />
              <div className={`${styles.corner} ${styles.bottomRight}`} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.modeBar}>
        <button
          onClick={() => setMode("scene")}
          className={
            mode === "scene"
              ? styles.activeMode
              : styles.modeButton
          }
        >
          🖼 Full Scene
        </button>

        <button
          onClick={() => setMode("focus")}
          className={
            mode === "focus"
              ? styles.activeMode
              : styles.modeButton
          }
        >
          🎯 Focus Area
        </button>
      </div>

      <div className={styles.controls}>
        <button className={styles.button}>
          📸 Capture
        </button>

        <button className={styles.button}>
          🎤 Voice
        </button>

        <button className={styles.button}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
});

CameraPanel.displayName = "CameraPanel";

export default CameraPanel;