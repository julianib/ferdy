import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import ConnectionToast from "./components/ConnectionToast";
import MainTabMenu from "./components/MainTabMenu";

export default function App() {
  return (
    <>
      <MainAppBar />
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
