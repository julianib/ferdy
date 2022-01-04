// execute backend script (connects to backend)
import "./util/backend";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme } from "./themes/darkTheme";
import { BrowserRouter } from "react-router-dom";
import { OnlineUsersContextProvider } from "./contexts/OnlineUsersContext";
import { ProfileContextProvider } from "./contexts/ProfileContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <OnlineUsersContextProvider>
          <ProfileContextProvider>
            <CssBaseline />
            <App />
          </ProfileContextProvider>
        </OnlineUsersContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
