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
    sendPacket("poll.list", null, true);
  }, []);

  return (
    <Grid container sx={{ mt: 0 }} spacing={1}>
      {polls.length ? (
        polls.map((poll) => (
          <Grid item xs={4} key={poll.id}>
            <Paper sx={{ p: 1 }} variant="outlined">
              <Typography variant="h5">{poll.title}</Typography>
              <Typography variant="body2">
                <pre style={{ fontFamily: "inherit" }}>{poll.body}</pre>
              </Typography>
              <Button variant="outlined">View</Button>
            </Paper>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography>No polls</Typography>
        </Grid>
      )}
    </Grid>
  );
}
