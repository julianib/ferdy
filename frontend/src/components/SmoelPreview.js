import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BACKEND } from "../utils/backend";
import SmoelComments from "./SmoelComments";

export default function SmoelPreview({ smoel }) {
  // preview selected smoel, to view comments etc
  return (
    <Paper sx={{ p: 1 }} variant="outlined">
      <Typography variant="h2">{smoel.name}</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <img
            style={{ width: "100%" }}
            src={`${BACKEND}/smoelen/${smoel.image_filename}`}
            alt={smoel.name}
          />
        </Grid>
        <Grid item xs={6}>
          <Paper variant="oulined">
            <Typography>Comments:</Typography>
            <SmoelComments smoel={smoel} />
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
