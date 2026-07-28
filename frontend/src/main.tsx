import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { VisionProvider } from "./context/VisionContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <VisionProvider>
      <App />
    </VisionProvider>
  </React.StrictMode>
);