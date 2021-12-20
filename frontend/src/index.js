import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { UserContextProvider } from "./contexts/UserContext";
// import Landing from "./components/Landing";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
      {/* <Landing /> */}
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
