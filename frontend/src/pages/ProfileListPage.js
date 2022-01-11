import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";
import { BACKEND } from "../utils/backend";
import timeAgo from "../utils/convertUnix";
import sendPacket from "../utils/sendPacket";

export default function ProfileListPage() {
  const [profiles, setProfiles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { openToast } = useToast();

  function onClickProfile(profile) {
    setSelectedProfile(profile);
    setUnsavedChanges(false);
  }

  function onClickDeleteProfile() {
    sendPacket("profile.delete", {
      entry_id: selectedProfile.entry_id,
    });
  }

  function onClickRole(role) {
    if (selectedProfile.role_ids.includes(role.entry_id)) {
      // remove role from profile
      let role_ids = selectedProfile.role_ids;
      role_ids = role_ids.filter((role_id) => role_id !== role.entry_id);

      setSelectedProfile({
        ...selectedProfile,
        role_ids,
      });
    } else {
      // add role to profile
      let role_ids = selectedProfile.role_ids;
      role_ids = [...role_ids, role.entry_id];

      setSelectedProfile({
        ...selectedProfile,
        role_ids,
      });
    }

    setUnsavedChanges(true);
  }

  function onClickSaveChanges() {
    const originalProfile = profiles.find(
      (profile) => profile.entry_id === selectedProfile.entry_id
    );

    if (originalProfile === undefined) {
      openToast("Profile does not exist anymore", "error");
      return;
    }

    const updatedProfile = {};

    // only update the properties that have actually been modified by the USER
    for (const key in originalProfile) {
      if (originalProfile[key] !== selectedProfile[key]) {
        updatedProfile[key] = selectedProfile[key];
      }
    }

    sendPacket("profile.update", {
      entry_id: originalProfile.entry_id,
      updated_data: updatedProfile,
    });

    setUnsavedChanges(false);
  }

  usePacket("profile.list", (content) => {
    setProfiles(content.profiles);
  });

  usePacket("role.list", (content) => {
    setRoles(content.roles);
  });

  useEffect(() => {
    sendPacket("profile.list");
    sendPacket("role.list");
  }, []);

  return (
    <Grid sx={{ mt: 0 }} container spacing={1}>
      <Grid item xs={4}>
        <List dense>
          {profiles.map((profile) => {
            return (
              <ListItemButton
                selected={selectedProfile?.entry_id === profile.entry_id}
                onClick={() => onClickProfile(profile)}
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
            );
          })}
        </List>
      </Grid>
      <Grid item xs={5}>
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

            <Box sx={{ mt: 1 }}>
              {roles
                ?.filter((role) =>
                  selectedProfile.role_ids.includes(role.entry_id)
                )
                .map((role) => (
                  <Chip
                    sx={{
                      borderColor: role.color_hex,
                      color: role.color_hex,
                    }}
                    variant="outlined"
                    size="small"
                    label={role.name}
                    key={role.entry_id}
                  />
                ))}
            </Box>

            <Typography sx={{ mt: 2 }} variant="body2">
              Email: {selectedProfile.email}
              <br />
              Google ID: {selectedProfile.google_id}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                sx={{ mr: 1 }}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={onClickDeleteProfile}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        )}
      </Grid>
      <Grid item xs={3}>
        {selectedProfile && (
          <Paper sx={{ p: 1 }} variant="outlined">
            <Button
              sx={{ display: "block" }}
              color="info"
              variant="outlined"
              disabled={!unsavedChanges}
              onClick={onClickSaveChanges}
            >
              Save changes
            </Button>

            <List sx={{ mt: 1 }} dense>
              {roles.map((role) => (
                <ListItemButton
                  sx={{ color: role.color_hex }}
                  onClick={() => onClickRole(role)}
                  key={role.entry_id}
                >
                  <Checkbox
                    sx={{
                      color: role.color_hex,
                      "&.Mui-checked": {
                        color: role.color_hex,
                      },
                    }}
                    checked={selectedProfile.role_ids.includes(role.entry_id)}
                  />
                  <ListItemText>{role.name}</ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
