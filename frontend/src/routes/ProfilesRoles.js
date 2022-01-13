import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import sendPacket from "../utils/sendPacket";

export default function ProfilesRoles() {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  function onClickRole(role) {
    setSelectedRole(role);
    setUnsavedChanges(false);
  }

  function onClickCreateRole() {
    sendPacket("role.create");
  }

  function onClickDeleteRole() {
    sendPacket("role.delete", {
      id: selectedRole.id,
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

  function onClickPermission(permission) {
    if (selectedRole.permissions.includes(permission)) {
      // remove permission from role

      let oldPermissions = selectedRole.permissions;
      let newPermissions = oldPermissions.filter(
        (oldPermission) => oldPermission !== permission
      );

      setSelectedRole({
        ...selectedRole,
        permissions: newPermissions,
      });
    } else {
      // add permission to role

      let oldPermissions = selectedRole.permissions;
      let newPermissions = [...oldPermissions, permission];

      setSelectedRole({
        ...selectedRole,
        permissions: newPermissions,
      });
    }

    setUnsavedChanges(true);
  }

  function onClickSaveChanges() {
    const originalRole = roles.find((role) => role.id === selectedRole.id);

    const updatedRole = {};

    for (const key in originalRole) {
      if (originalRole[key] !== selectedRole[key]) {
        updatedRole[key] = selectedRole[key];
      }
    }

    sendPacket("role.update", {
      id: originalRole.id,
      updated_data: updatedRole,
    });

    setUnsavedChanges(false);
  }

  usePacket("permission.list", (content) => {
    setPermissions(content.data);
  });

  usePacket("role.list", (content) => {
    setRoles(content.data);
  });

  useEffect(() => {
    sendPacket("role.list");
    sendPacket("permission.list");
  }, []);

  return (
    <Grid sx={{ mt: 0 }} container spacing={1}>
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
          {roles.length ? (
            roles.map((role) => (
              <ListItemButton
                sx={{ color: role.color_hex }}
                selected={selectedRole?.id === role.id}
                onClick={() => onClickRole(role)}
                key={role.id}
              >
                <ListItemText>{role.name}</ListItemText>
              </ListItemButton>
            ))
          ) : (
            <ListItemButton>
              <ListItemText primary="No roles" />
            </ListItemButton>
          )}
        </List>
      </Grid>
      <Grid item xs={5}>
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
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={onClickDeleteRole}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        )}
      </Grid>
      <Grid item xs={3}>
        {selectedRole && (
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
              {permissions.map((permission) => (
                <ListItemButton
                  onClick={() => onClickPermission(permission)}
                  key={permission}
                >
                  <Checkbox
                    checked={selectedRole.permissions.includes(permission)}
                  />
                  <ListItemText>{permission}</ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
