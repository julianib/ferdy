import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useProfile from "../hooks/useProfile";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileIconButton() {
  const { profile } = useProfile();

  return (
    <Tooltip title={profile ? `Logged in as ${profile.name}` : "Not logged in"}>
      <IconButton edge="end" color="inherit">
        {profile ? <ProfileAvatar profile={profile} /> : <NoAccountsIcon />}
      </IconButton>
    </Tooltip>
  );
}
