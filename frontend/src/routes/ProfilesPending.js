import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import { BACKEND } from "../utils/backend";
import timeAgo from "../utils/convertUnix";
import sendPacket from "../utils/sendPacket";

export default function ProfilesPending() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  function onClickApproval(approved) {
    sendPacket("profile.approval", {
      approved,
      id: selectedProfile.id,
    });
  }

  function onClickProfile(profile) {
    setSelectedProfile(profile);
  }

  usePacket("profile.list", (content) => {
    const profiles = content.data.filter((profile) => profile.pending_approval);
    setProfiles(profiles);
  });

  useEffect(() => {
    // todo optimize: filter on pending
    sendPacket("profile.list");
  }, []);

  return (
    <Grid sx={{ mt: 0 }} container spacing={1}>
      <Grid item xs={4}>
        <List dense>
          {profiles.length ? (
            profiles.map((profile) => (
              <ListItemButton
                selected={selectedProfile?.id === profile.id}
                onClick={() => onClickProfile(profile)}
                key={profile.id}
              >
                <ListItemAvatar
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  <Avatar
                    src={
                      profile.avatar_external
                        ? profile.avatar_url
                        : `${BACKEND}/avatars/${profile.avatar_url}`
                    }
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={profile.name}
                  secondaryTypographyProps={
                    profile.is_online ? { sx: { color: "success.dark" } } : null
                  }
                  secondary={
                    profile.is_online
                      ? "Online"
                      : `Last seen: ${timeAgo(profile.last_seen_unix)}`
                  }
                />
              </ListItemButton>
            ))
          ) : (
            <ListItemButton>
              <ListItemText primary="No profiles pending approval" />
            </ListItemButton>
          )}
        </List>
      </Grid>

      <Grid item xs={8}>
        {selectedProfile && (
          <Paper sx={{ p: 1 }} variant="outlined">
            <Avatar
              src={
                selectedProfile.avatar_external
                  ? selectedProfile.avatar_url
                  : `${BACKEND}/avatars/${selectedProfile.avatar_url}`
              }
            />

            <Typography sx={{ mt: 1 }} variant="h5">
              {selectedProfile.name}
            </Typography>

            <Typography sx={{ mt: 1 }} variant="body2">
              Email: {selectedProfile.email}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <ButtonGroup variant="outlined">
                <Button
                  color="success"
                  startIcon={<DoneIcon />}
                  onClick={() => onClickApproval(true)}
                >
                  Approve
                </Button>
                <Button
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => onClickApproval(false)}
                >
                  Refuse
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
