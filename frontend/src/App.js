import { Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import useOnlineUsers from "./hooks/useOnlineUsers";
import usePacket from "./hooks/usePacket";
import usePackets from "./hooks/usePackets";
import useProfile from "./hooks/useProfile";
import useToast from "./hooks/useToast";
import Accies from "./routes/Accies";
import Chat from "./routes/Chat";
import Home from "./routes/Home";
import Polls from "./routes/Polls";
import PollsAll from "./routes/PollsAll";
import PollsCreate from "./routes/PollsCreate";
import Profiles from "./routes/Profiles";
import ProfilesAll from "./routes/ProfilesAll";
import ProfilesPending from "./routes/ProfilesPending";
import ProfilesRoles from "./routes/ProfilesRoles";
import Root from "./routes/Root";
import Settings from "./routes/Settings";
import Smoelenboek from "./routes/Smoelenboek";
import Wildcard from "./routes/Wildcard";

export default function App() {
  const { setOnlineProfiles, setLoggedInUserCount, setUserCount } =
    useOnlineUsers();
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

  usePackets(["user.connect", "user.disconnect"], (content) => {
    setOnlineProfiles(content.online_profiles);
    setLoggedInUserCount(content.logged_in_user_count);
    setUserCount(content.user_count);
  });

  return (
    <>
      {true ? (
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="accies" element={<Accies />} />
            <Route path="chat" element={<Chat />} />
            <Route path="polls" element={<Polls />}>
              <Route index element={<PollsAll />} />
              <Route path="create" element={<PollsCreate />} />
            </Route>
            <Route path="profiles" element={<Profiles />}>
              <Route index element={<ProfilesAll />} />
              <Route path="pending" element={<ProfilesPending />} />
              <Route path="roles" element={<ProfilesRoles />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="smoelenboek" element={<Smoelenboek />} />
          </Route>
          <Route path="*" element={<Wildcard />} />
        </Routes>
      ) : (
        <Typography>Logo {profile?.name}</Typography>
      )}
    </>
  );
}
