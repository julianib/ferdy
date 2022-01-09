import { Badge, IconButton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import usePackets from "../hooks/usePackets";
import useOnlineUsers from "../hooks/useOnlineUsers";

export default function OnlineUsersIconButton() {
  const { setOnlineProfiles, setLoggedInUserCount, userCount, setUserCount } =
    useOnlineUsers();

  usePackets(["user.connected", "user.disconnected"], (content) => {
    setOnlineProfiles(content.online_profiles);
    setLoggedInUserCount(content.logged_in_user_count);
    setUserCount(content.user_count);
  });

  return (
    <IconButton size="large" color="inherit">
      <Badge badgeContent={userCount} color="secondary">
        <PeopleIcon />
      </Badge>
    </IconButton>
  );
}