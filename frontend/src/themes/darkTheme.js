import { createTheme } from "@mui/material";

// https://bareynol.github.io/mui-theme-creator

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7e00",
    },
    secondary: {
      main: "#ff3800",
    },
    error: {
      main: "#cc0000",
    },
  },
});
