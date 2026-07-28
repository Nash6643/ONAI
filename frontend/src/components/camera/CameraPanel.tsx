import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Webcam from "react-webcam";
import { useVision } from "../../context/VisionContext";
import styles from "./CameraPanel.module.css";

export interface CameraHandle {
  captureImage: () => string | null;
  startLiveCapture: () => void;
  stopLiveCapture: () => void;
}

const CameraPanel = forwardRef<CameraHandle>((_, ref) => {

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<number | null>(null);

const { setLatestFrame } = useVision();

useImperativeHandle(ref, () => ({
  captureImage() {
    return webcamRef.current?.getScreenshot() || null;
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

  return (
    <div className={styles.cameraPanel}>

      <div className={styles.header}>

        <div className={styles.title}>
          📷 Live Vision
        </div>

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

  <div className={styles.scanBox}>
  <div className={styles.scanLabel}>
    Focus Area
  </div>

    <div className={styles.scanLabel}>
      Focus Area
    </div>

    <div className={`${styles.corner} ${styles.topLeft}`} />
    <div className={`${styles.corner} ${styles.topRight}`} />
    <div className={`${styles.corner} ${styles.bottomLeft}`} />
    <div className={`${styles.corner} ${styles.bottomRight}`} />

  </div>

</div>

</div>

      <div className={styles.controls}>

        <button className={styles.button}>
          📸 Capture
        </button>

        <button className={styles.button}>
          🎤 Voice
        </button>
        <button className={styles.button}>
    ⚙ Settings
  </button>

      </div>

    </div>
  );

});

CameraPanel.displayName="CameraPanel";

export default CameraPanel;