import { Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { BACKEND } from "../utils/backend";

export default function Smoelenboek() {
  const [smoelen, setSmoelen] = useState([]);

  function onClickVote(upvote) {
    sendPacket();
  }

  usePacket("smoel.list", (content) => {
    setSmoelen(content.data);
  });

  useEffect(() => {
    sendPacket("smoel.list");
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          sendPacket("database.smoel.generate");
        }}
      >
        Generate missing
      </Button>
      <Grid container sx={{ mt: 0 }} spacing={1}>
        {smoelen.length ? (
          smoelen.map((smoel) => (
            <Grid item xs={3} key={smoel.id}>
              <Paper sx={{ p: 1 }} variant="outlined">
                <Typography variant="h5">{smoel.name}</Typography>
                <div sx={{ width: "100%" }}>
                  {/* todo fix humongous big image ??????????? */}
                  <img
                    sx={{ width: "100%" }}
                    src={`${BACKEND}/smoelen/${smoel.image_filename}`}
                    alt={smoel.name}
                  />
                </div>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ThumbUpIcon />}
                  onClick={() => onClickVote(smoel.id, true)}
                >
                  Like
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ThumbDownIcon />}
                  onClick={() => onClickVote(false)}
                >
                  Dislike
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>Geen smoelen</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
