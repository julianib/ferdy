import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { UserContextProvider } from "./contexts/UserContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme } from "./themes/darkTheme";
import { BrowserRouter } from "react-router-dom";

// execute backend script (connects to backend)
import "./util/backend";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <UserContextProvider>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </UserContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
