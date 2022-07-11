import Avatar from "@mui/material/Avatar";
import { BACKEND } from "../utils/backend";

export default function ProfileAvatar({ profile }) {
  return (
    <Avatar
      sx={{ bgcolor: "#00dddd", color: "#fff" }}
      src={
        profile.avatar_external
          ? profile.avatar_filename
          : `${BACKEND}/avatars/${profile.avatar_filename}`
      }
      alt={profile.name}
    />
  );
}
