import PeopleIcon from "@mui/icons-material/People";
import { Badge, IconButton } from "@mui/material";
import useOnlineUsers from "../hooks/useOnlineUsers";

export default function OnlineUsersIconButton() {
  const { userCount } = useOnlineUsers();

  return (
    <IconButton size="large" color="inherit">
      <Badge badgeContent={userCount} color="secondary">
        <PeopleIcon />
      </Badge>
    </IconButton>
  );
}
