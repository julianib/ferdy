import { Avatar } from "@mui/material";
import { BACKEND } from "../utils/backend";

export default function ProfileAvatar({ profile }) {
  return (
    <Avatar
      src={
        profile.avatar_external
          ? profile.avatar_filename
          : `${BACKEND}/avatars/${profile.avatar_filename}`
      }
      alt={profile.name}
    />
  );
}
