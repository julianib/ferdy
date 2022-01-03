import { AppBar, Container, Toolbar } from "@mui/material";
import MainTabMenu from "./components/MainTabMenu";
import { usePacket } from "./hooks/usePacket";

export default function App() {
  usePacket("connect", () => {
    console.debug("Connected");
    // todo show toast
  })

  usePacket("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    // todo show toast
  })

  usePacket("connect_error", (error) => {
    console.warn("Connect error:", error);
    // todo show toast
  })
  

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
    </>
  );
}
