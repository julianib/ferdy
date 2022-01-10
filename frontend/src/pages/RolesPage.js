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
} from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { openToast } = useToast();

  function onClickRole(role) {
    setSelectedRole(role);
    setUnsavedChanges(false);
  }

  function onClickCreateRole() {
    sendPacket("role.create");
  }

  function onClickDeleteRole() {
    sendPacket("role.delete", {
      entry_id: selectedRole.entry_id,
    });
  }

  function onChangeRoleColor(event) {
    setSelectedRole({ ...selectedRole, color_hex: event.target.value });
    setUnsavedChanges(true);
  }

  function onChangeRoleName(event) {
    setSelectedRole({ ...selectedRole, name: event.target.value });
    setUnsavedChanges(true);
  }

  function onClickSaveChanges() {
    const originalRole = roles.find(
      (role) => role.entry_id === selectedRole.entry_id
    );

    const updatedRole = {};

    for (const key in originalRole) {
      if (originalRole[key] !== selectedRole[key]) {
        updatedRole[key] = selectedRole[key];
      }
    }

    sendPacket("role.update", {
      entry_id: originalRole.entry_id,
      updated_role: updatedRole,
    });

    setUnsavedChanges(false);
  }

  usePacket("role.create.error", (content) => {
    openToast(`Couldn't create role: ${content.error}`, "error");
  });

  usePacket("role.create.ok", (content) => {
    openToast(`Created role: ${content.role.name}`, "success");
  });

  usePacket("role.delete.error", (content) => {
    openToast(`Couldn't delete role: ${content.error}`, "error");
  });

  usePacket("role.delete.ok", (content) => {
    openToast(`Deleted role: ${content.role.name}`, "success");
  });

  usePacket("role.update.ok", (content) => {
    openToast(`Updated role: ${content.role.name}`, "success");
  });

  usePacket("role.list.ok", (content) => {
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
              <ListItemText>{role.name}</ListItemText>
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

            <TextField
              sx={{ mt: 1, display: "block" }}
              label="Name"
              autoComplete="off"
              value={selectedRole.name || ""}
              onChange={onChangeRoleName}
            />

            <TextField
              sx={{ mt: 1, display: "block" }}
              label="Color"
              autoComplete="off"
              value={selectedRole.color_hex || ""}
              onChange={onChangeRoleColor}
            />

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
