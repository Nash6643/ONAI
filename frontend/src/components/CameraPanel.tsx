import { useRef } from "react";
import Webcam from "react-webcam";
import api from "../services/api";

export default function CameraPanel() {

    const webcamRef = useRef<Webcam>(null);

    const capture = async () => {

        const image = webcamRef.current?.getScreenshot();

        if (!image) return;

        try {

            const response = await api.post("/analyze", {

                image: image

            });

            alert(response.data.message);

        } catch (error) {

            console.error(error);

            alert("Backend connection failed.");

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
                    overflow: "hidden",
                    borderRadius: "12px",
                }}
            >

                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored
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
                📸 Capture & Send
            </button>

        </div>

    );

}