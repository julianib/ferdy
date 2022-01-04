import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItemButton,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    sendPacket("role.list");
  }, []);

  return (
    <Grid container>
      <Grid item xs={4}>
        <List>
          {roles.map((role) => (
            <ListItemButton key={role}></ListItemButton>
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
