import { Container } from "@mui/material";
import ConnectionToast from "./components/ConnectionToast";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";
import LoginOrLogoutButton from "./components/LoginOrLogoutButton";
import usePacket from "./hooks/usePacket";
import usePackets from "./hooks/usePackets";
import { useContext } from "react";
import { OnlineUsersContext } from "./contexts/OnlineUsersContext";
import { ProfileContext } from "./contexts/ProfileContext";

export default function App() {
  const { setLoggedInUsers, setLoggedInUserCount, setUserCount } =
    useContext(OnlineUsersContext);

  usePackets(["user.connected", "user.disconnected"], (content) => {
    setLoggedInUsers(content.logged_in_users);
    setLoggedInUserCount(content.logged_in_user_count);
    setUserCount(content.user_count);
  });

  const { setProfile } = useContext(ProfileContext);

  usePacket("user.logged_in", (content) => {
    if (content.you) {
      setProfile(content.profile);
    }

    console.info(content.profile.name, "logged in");
  });

  usePacket("user.logged_out", (content) => {
    if (content.you) {
      setProfile(null);
    }

    console.info(content.profile.name, "logged out");
  });

  return (
    <>
      <MainAppBar />
      <Container
      // sx={{
      //   // offset from appbar
      //   // todo <=300px suddenly makes the appbar 8px taller?
      //   mt: {
      //     xs: 6,
      //     sm: 8,
      //   },
      // }}
      >
        <MainTabMenu />
        <br /> <br /> <br /> <br />
        <LoginOrLogoutButton />
      </Container>
      <ConnectionToast />
    </>
  );
}
