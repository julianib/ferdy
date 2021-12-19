import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SocketContextProvider } from "./SocketContext";

ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
