import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import {
  VisionSettingsProvider,
} from "./context/VisionSettingsContext";

import "./index.css";

import { VisionProvider } from "./context/VisionContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
<VisionProvider>

<VisionSettingsProvider>

    <App/>

</VisionSettingsProvider>

</VisionProvider>
  </React.StrictMode>
);