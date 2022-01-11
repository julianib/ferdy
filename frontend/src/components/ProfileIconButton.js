import { Avatar, IconButton, Tooltip } from "@mui/material";
import useProfile from "../hooks/useProfile";
import { BACKEND } from "../utils/backend";

export default function ProfileIconButton() {
  const { profile } = useProfile();

  return (
    <IconButton edge="end" color="inherit">
      {profile ? (
        <Tooltip title={`Logged in as ${profile.name}`}>
          <Avatar
            src={
              profile.avatar_external
                ? profile.avatar_url
                : `${BACKEND}/avatars/${profile.avatar_url}`
            }
          />
        </Tooltip>
      ) : (
        <Tooltip title="Not logged in">
          <Avatar />
        </Tooltip>
      )}
    </IconButton>
  );
}
