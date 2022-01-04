import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

export default function ProfileIconButton() {
  const { profile } = useContext(ProfileContext);

  return (
    <IconButton edge="end" color="inherit">
      {profile ? (
        <Tooltip title={`Logged in as ${profile.name}`}>
          <Avatar src={profile.avatar_url} />
        </Tooltip>
      ) : (
        <Tooltip title="Not logged in">
          <Avatar />
        </Tooltip>
      )}
    </IconButton>
  );
}
