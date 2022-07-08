import { Avatar } from "@mui/material";
import { BACKEND } from "../utils/backend";

export default function ProfileAvatar({ profile }) {
  return (
    <Avatar
      src={
        profile.avatar_external
          ? profile.avatar_url
          : `${BACKEND}/avatars/${profile.avatar_url}`
      }
      alt={profile.name}
    />
  );
}
