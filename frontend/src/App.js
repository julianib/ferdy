import { AppBar, Container, Toolbar } from "@mui/material";
import TabMenuMain from "./components/TabMenuMain";
import { usePacket } from "./hooks/usePacket";

export default function App() {
  usePacket("connect", () => {
    console.debug("Connected");
  })

  usePacket("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
  })

  usePacket("connect_error", (error) => {
    console.warn("Connect error:", error);
  })
  

  return (
    <>
      <AppBar
        enableColorOnDark
        sx={{
          // remove the mui brightening background image gradient
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
        <TabMenuMain />
      </Container>
    </>
  );
}
