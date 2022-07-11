import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useOnlineUsers from "../hooks/useOnlineUsers";

export default function OnlineUsersIconButton() {
  const { userCount, loggedInUserCount } = useOnlineUsers();

  return (
    <Tooltip title={`Online: ${userCount} (logged in: ${loggedInUserCount})`}>
      <IconButton size="large" color="inherit">
        <Badge badgeContent={userCount} color="secondary">
          <PeopleIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
