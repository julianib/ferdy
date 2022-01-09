import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePackets from "../hooks/usePackets";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";

export default function UserRolesPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { openToast } = useToast();

  function onClickRole(role) {
    setSelectedRole(role);
  }

  function onClickCreateRole() {
    sendPacket("role.create");
  }

  function onClickDeleteRole() {
    sendPacket("role.delete", {
      entry_id: selectedRole.entry_id,
    });
  }

  function onChangeRoleName(event) {
    setSelectedRole({ ...selectedRole, name: event.target.value });
    setUnsavedChanges(true);
    console.debug("changed name", selectedRole);
  }

  function onClickSaveChanges() {
    setUnsavedChanges(false);
  }

  usePacket("role.create.fail", (content) => {
    openToast(`Couldn't create role: ${content.error}`, "error");
  });

  usePacket("role.create.ok", (content) => {
    openToast(`Created role: ${content.role.name}`, "success");
  });

  usePacket("role.delete.fail", (content) => {
    openToast(`Couldn't delete role: ${content.error}`, "error");
  });

  usePacket("role.delete.ok", (content) => {
    openToast(`Deleted role: ${content.role.name}`, "success");
  });

  usePackets(["role.list.ok"], (content) => {
    setRoles(content.roles);
  });

  useEffect(() => {
    sendPacket("role.list");
  }, []);

  return (
    <Grid sx={{ mt: 1 }} container>
      <Grid item xs={4}>
        <Button
          sx={{ mr: 1 }}
          startIcon={<AddIcon />}
          variant="outlined"
          color="success"
          onClick={onClickCreateRole}
        >
          Create
        </Button>
        <List dense>
          {roles.map((role) => (
            <ListItemButton
              sx={{ color: role.color_hex }}
              selected={selectedRole?.entry_id === role.entry_id}
              onClick={() => onClickRole(role)}
              key={role.entry_id}
            >
              <ListItemText color={role.color_hex}>{role.name}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Grid>
      <Grid item xs={8}>
        {selectedRole && (
          <Paper sx={{ p: 1 }} variant="outlined">
            <Button
              color="info"
              variant="outlined"
              disabled={!unsavedChanges}
              onClick={onClickSaveChanges}
            >
              Save changes
            </Button>

            <br />

            <TextField
              label="Test"
              autoComplete="off"
              value={selectedRole.name || ""}
              onChange={onChangeRoleName}
            />

            {/* <Typography variant="h5">{selectedRole.name}</Typography> */}

            <Typography variant="body1">
              Color: {selectedRole.color_hex}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                sx={{ mr: 1 }}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={onClickDeleteRole}
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
