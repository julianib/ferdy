import { Typography } from "@mui/material";
import { useState } from "react";
import { usePackets } from "../hooks/usePacket";

export default function UsersAllPage() {
  const [users, setUsers] = useState([]);

  // todo onEffect([]) send packet requesting users, as component can unmount

  usePackets(["user.connected", "user.disconnected"], (content) => {
    setUsers(content.users);
  });

  return users.map((element) => (
    <Typography key={element}>{element}</Typography>
  ));
}
