import { Container } from "@mui/material";
import LoginOrLogoutButton from "./components/LoginOrLogoutButton";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";
import Toast from "./components/Toast";
import usePacket from "./hooks/usePacket";
import useProfile from "./hooks/useProfile";
import useToast from "./hooks/useToast";

export default function App() {
  const { profile, setProfile } = useProfile();
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
      {profile?.is_approved ? (
        <>
          <MainAppBar />
          <Container sx={{ mb: 20 }}>
            <MainTabMenu />
            <br />
            <LoginOrLogoutButton />
          </Container>
          <Toast />
        </>
      ) : (
        <>
          <LoginOrLogoutButton />
          INSERT LOGO
        </>
      )}
    </>
  );
}
