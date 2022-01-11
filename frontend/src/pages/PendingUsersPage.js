import { Grid, List, ListItemButton } from "@mui/material";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import sendPacket from "../utils/sendPacket";

export default function PendingUsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  function onClickProfile(profile) {
    setSelectedProfile(profile);
  }

  usePacket("profile.list", (content) => {
    setProfiles(content.profiles);
  });

  useEffect(() => {
    sendPacket("profile.list", {
      filter: {
        is_approved: false,
      },
    });
  });

  return (
    <Grid sx={{ mt: 0 }} container spacing={1}>
      <Grid item xs={4}>
        <List dense>
          {profiles.map((profile) => (
            <ListItemButton
              selected={selectedProfile?.entry_id === profile.entry_id}
              onClick={() => onClickProfile(profile)}
              key={profile.entry_id}
            ></ListItemButton>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
