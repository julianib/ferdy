import { Container } from "@mui/material";
import Toast from "./components/Toast";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";
import LoginOrLogoutButton from "./components/LoginOrLogoutButton";
import useToast from "./hooks/useToast";
import usePacket from "./hooks/usePacket";
import useProfile from "./hooks/useProfile";

export default function App() {
  const { setProfile } = useProfile();

  const { openToast } = useToast();

  usePacket("connect", () => {
    console.log("Connected");
    openToast("Connected", "info", 1000);
  });

  usePacket("connect_error", (error) => {
    openToast(`Couldn't connect: ${error.message}`, "error", 1000);
  });

  usePacket("disconnect", (reason) => {
    console.log("Disconnected:", reason);
    openToast(`Disconnected: ${reason}`, "error", 1000);

    // clear profile if we get disconnected
    setProfile(null);
  });

  usePacket("error", (content) => {
    if (content.response_to_name) {
      openToast(
        `Error on ${content.response_to_name}: ${content.error}`,
        "error"
      );
    } else {
      openToast(`Error: ${content.error}`, "error");
    }
  });

  usePacket("ok", (content) => {
    if (content.response_to_name) {
      openToast(`Success: ${content.response_to_name}`, "success");
    } else {
      openToast(`Success`, "success");
    }
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
