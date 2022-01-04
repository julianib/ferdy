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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePackets from "../hooks/usePackets";

export default function UserRolesPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);

  function clickedRole(role) {
    setSelectedRole(role);
  }

  function createRole() {
    sendPacket("role.create");
  }

  function deleteSelectedRole() {
    sendPacket("role.delete", {
      entry_id: selectedRole.entry_id,
    });
  }

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
          onClick={createRole}
        >
          Create
        </Button>
        <List dense>
          {roles.map((role) => (
            <ListItemButton
              sx={{ color: role.color_hex }}
              selected={selectedRole?.entry_id === role.entry_id}
              onClick={() => clickedRole(role)}
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
            <Typography variant="h5">{selectedRole.name}</Typography>

            <Typography variant="body1">
              Color: {selectedRole.color_hex}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                sx={{ mr: 1 }}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                onClick={deleteSelectedRole}
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
