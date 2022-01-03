import { AppBar, Container, Toolbar } from "@mui/material";
import ConnectionToast from "./components/ConnectionToast";
import MainTabMenu from "./components/MainTabMenu";

export default function App() {
  return (
    <>
      <AppBar
        enableColorOnDark
        sx={{
          // removes the mui brightening background image gradient
          backgroundImage: "none",
        }}
      >
        <Container>
          <Toolbar>Ferdy</Toolbar>
        </Container>
      </AppBar>
      <Container
        sx={{
          // offset from appbar
          mt: 8,
        }}
      >
        <MainTabMenu />
      </Container>
      <ConnectionToast />
    </>
  );
}
