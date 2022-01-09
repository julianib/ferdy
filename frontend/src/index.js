// execute backend script (connects to backend)
import "./utils/backend";

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
import { ToastContextProvider } from "./contexts/ToastContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <OnlineUsersContextProvider>
          <ProfileContextProvider>
            <ToastContextProvider>
              <CssBaseline />
              <App />
            </ToastContextProvider>
          </ProfileContextProvider>
        </OnlineUsersContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
