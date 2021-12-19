import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AllContextProviders } from "./contexts/AllContexts";

ReactDOM.render(
  <React.StrictMode>
    <AllContextProviders>
      <App />
    </AllContextProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
