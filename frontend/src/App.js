import { Container } from "@mui/material";
import Toast from "./components/Toast";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";
import LoginOrLogoutButton from "./components/LoginOrLogoutButton";
import useToast from "./hooks/useToast";
import usePacket from "./hooks/usePacket";

export default function App() {
  const { openToast } = useToast();

  usePacket("connect", () => {
    console.log("Connected");
    openToast("Connected");
  });

  usePacket("connect_error", (error) => {
    openToast(`Couldn't connect: ${error.message}`, "error");
  });

  usePacket("disconnect", (reason) => {
    console.warn("Disconnected:", reason);
    openToast(`Disconnected: ${reason}`);
  });

  usePacket("error", (content) => {
    openToast(`Error: ${content.error}`, "error");
  });

  return (
    <>
      <MainAppBar />
      <Container>
        <MainTabMenu />
        <br />
        <LoginOrLogoutButton />
      </Container>
      <Toast />
    </>
  );
}
