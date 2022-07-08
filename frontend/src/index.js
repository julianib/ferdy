import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { OnlineUsersContextProvider } from "./contexts/OnlineUsersContext";
import { ProfileContextProvider } from "./contexts/ProfileContext";
import { ToastContextProvider } from "./contexts/ToastContext";
import "./index.css";
import { darkTheme } from "./themes/darkTheme";
import "./utils/backend"; // start backend connection script

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
