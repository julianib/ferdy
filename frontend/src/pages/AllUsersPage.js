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
import sendPacket from "../utils/sendPacket";
import DeleteIcon from "@mui/icons-material/Delete";
import timeAgo from "../utils/convertUnix";

export default function UsersAllPage() {
  const [profileList, setProfileList] = useState([]);

  // todo make list with ListItemButtons on the left and a settings screen on the right to customize user roles etc
  const [selectedProfile, setSelectedProfile] = useState(null);

  function clickedProfile(profile) {
    setSelectedProfile(profile);
  }

  function deleteSelectedProfile() {
    sendPacket("profile.delete", {
      entry_id: selectedProfile.entry_id,
    });
  }

  usePacket("profile.list.ok", (content) => {
    setProfileList(content.profiles);
  });

  useEffect(() => {
    sendPacket("profile.list");
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <List dense>
          {profileList.map((profile) => {
            return (
              <ListItemButton
                selected={selectedProfile?.entry_id === profile.entry_id}
                onClick={() => clickedProfile(profile)}
                key={profile.entry_id}
              >
                <ListItemAvatar
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  <Avatar src={profile.avatar_url} />
                </ListItemAvatar>

                <ListItemText
                  primary={profile.name}
                  secondary={
                    profile.is_online
                      ? "Online"
                      : `Last seen: ${timeAgo(profile.last_seen_unix)}`
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={8}>
        {selectedProfile && (
          <Paper sx={{ mt: 1, p: 1 }} elevation={10}>
            <Avatar src={selectedProfile.avatar_url} />

            <Typography sx={{ mt: 2 }} variant="h5">
              {selectedProfile.name}
            </Typography>

            {/* insert roles here */}

            <Typography sx={{ mt: 2 }} variant="body1">
              Email: {selectedProfile.email}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                sx={{ mr: 1 }}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={deleteSelectedProfile}
              >
                Delete
              </Button>

              <ButtonGroup variant="outlined">
                <Button>test</Button>
                <Button>test</Button>
              </ButtonGroup>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
