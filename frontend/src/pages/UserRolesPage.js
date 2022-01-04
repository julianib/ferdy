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
} from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";

export default function UserRolesPage() {
  const [roles, setRoles] = useState([]);

  function addRole() {}

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
          onClick={addRole}
        >
          Add
        </Button>
        <List>
          {roles.map((role) => (
            <ListItemButton key={role.entry_id}>
              <ListItemText color={role.color_hex}>{role.name}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Grid>
      <Grid item xs={8}>
        <Paper sx={{ p: 1 }} variant="outlined">
          <Box>
            <ButtonGroup variant="outlined">
              <Button
                sx={{ mr: 1 }}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={null}
              >
                Delete
              </Button>
              <Button>test</Button>
            </ButtonGroup>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
