import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";
import timeAgo from "../utils/convertUnix";
import sendPacket from "../utils/sendPacket";
import ProfileAvatar from "../components/ProfileAvatar";

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { openToast } = useToast();

  function onClickApproval(approved) {
    const originalProfile = profiles.find(
      (profile) => profile.id === selectedProfile.id
    );

    if (originalProfile === undefined) {
      openToast("Profile does not exist anymore", "error");
      return;
    }

    setSelectedProfile({
      ...selectedProfile,
      is_approved: approved,
    });

    sendPacket("profile.approval", {
      approved,
      id: selectedProfile.id,
    });
  }

  function onClickDeleteProfile() {
    const originalProfile = profiles.find(
      (profile) => profile.id === selectedProfile.id
    );

    if (originalProfile === undefined) {
      openToast("Profile does not exist anymore", "error");
      return;
    }

    sendPacket("profile.delete", {
      id: selectedProfile.id,
    });
  }

  // selects specific profile id, useEffect(.., [id]) updates the rest
  function onClickProfile(profile) {
    setSelectedProfileId(profile.id);
    setUnsavedChanges(false);
  }

  function onClickRole(role) {
    if (selectedProfile.role_ids.includes(role.id)) {
      // remove role from profile
      let role_ids = selectedProfile.role_ids;
      role_ids = role_ids.filter((role_id) => role_id !== role.id);

      setSelectedProfile({
        ...selectedProfile,
        role_ids,
      });
    } else {
      // add role to profile
      let role_ids = selectedProfile.role_ids;
      role_ids = [...role_ids, role.id];

      setSelectedProfile({
        ...selectedProfile,
        role_ids,
      });
    }

    setUnsavedChanges(true);
  }

  function onClickSaveChanges() {
    const originalProfile = profiles.find(
      (profile) => profile.id === selectedProfile.id
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
      id: originalProfile.id,
      updated_data: updatedProfile,
    });

    setUnsavedChanges(false);
  }

  usePacket("profile.list", (content) => {
    setProfiles(content.data);
  });

  usePacket("role.list", (content) => {
    setRoles(content.data);
  });

  useEffect(() => {
    sendPacket("profile.list", null, true);
    sendPacket("role.list", null, true);
  }, []);

  // update displayed selected profile when "profiles" array changes
  useEffect(() => {
    const newSelectedProfile = profiles.find(
      (profile) => selectedProfileId === profile.id
    );

    setSelectedProfile(newSelectedProfile);
  }, [profiles, selectedProfileId]);

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
                  <ProfileAvatar profile={profile} />
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
              <ListItemText primary="No profiles" />
            </ListItemButton>
          )}
        </List>
      </Grid>

      <Grid item xs={5}>
        {selectedProfile && (
          <Paper sx={{ p: 1 }} variant="outlined">
            <ProfileAvatar profile={selectedProfile} />
            <Typography sx={{ mt: 1 }} variant="h5">
              {selectedProfile.name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {roles
                ?.filter((role) => selectedProfile.role_ids.includes(role.id))
                .map((role) => (
                  <Chip
                    sx={{
                      borderColor: role.color_hex,
                      color: role.color_hex,
                    }}
                    variant="outlined"
                    size="small"
                    label={role.name}
                    key={role.id}
                  />
                ))}
            </Box>
            <Typography sx={{ mt: 1 }} variant="body2">
              Approved:
              {selectedProfile.is_approved ? (
                <DoneIcon size="small" />
              ) : selectedProfile.pending_approval ? (
                <HourglassBottomIcon />
              ) : (
                <ClearIcon size="small" />
              )}
              <br />
              Email: {selectedProfile.email}
              <br />
              ID: {selectedProfile.id}
              <br />
              Google ID: {selectedProfile.google_id}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ButtonGroup sx={{ display: "block" }} variant="outlined">
                <Button
                  // approve button should be enabled when:
                  // pending approval is true OR not approved
                  disabled={
                    !selectedProfile.pending_approval &&
                    selectedProfile.is_approved
                  }
                  color="success"
                  startIcon={<DoneIcon />}
                  onClick={() => onClickApproval(true)}
                >
                  Approve
                </Button>
                <Button
                  disabled={
                    !selectedProfile.pending_approval &&
                    !selectedProfile.is_approved
                  }
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => onClickApproval(false)}
                >
                  Refuse
                </Button>
              </ButtonGroup>

              <Button
                sx={{ mt: 1 }}
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
                  key={role.id}
                >
                  <Checkbox
                    sx={{
                      color: role.color_hex,
                      "&.Mui-checked": {
                        color: role.color_hex,
                      },
                    }}
                    checked={selectedProfile.role_ids.includes(role.id)}
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
