import { Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import usePacket from "../hooks/usePacket";
import sendPacket from "../utils/sendPacket";

export default function PollsAll() {
  const [polls, setPolls] = useState([]);

  usePacket("poll.list", (content) => {
    setPolls(content.data);
  });

  useEffect(() => {
    sendPacket("poll.list");
  }, []);

  return (
    <Grid container sx={{ mt: 0 }} spacing={2}>
      {polls.length ? (
        polls.map((poll) => (
          <Grid item xs={3} key={poll.id}>
            <Paper sx={{ p: 1 }} variant="outlined">
              <Typography variant="h5">{poll.title}</Typography>
              <Typography variant="body2">{poll.body}</Typography>
              <Button variant="outlined">View</Button>
            </Paper>
          </Grid>
        ))
      ) : (
        <Typography>No polls</Typography>
      )}
    </Grid>
  );
}
