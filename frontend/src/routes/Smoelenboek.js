import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import Smoel from "../components/Smoel";

export default function Smoelenboek() {
  const [smoelen, setSmoelen] = useState([]);

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
      <Button
        onClick={() => {
          sendPacket("smoel.list");
        }}
      >
        Refresh
      </Button>
      <Grid container sx={{ mt: 0 }} spacing={1}>
        {smoelen.length ? (
          smoelen.map((smoel) => (
            <Grid item xs={3} key={smoel.id}>
              <Smoel smoel={smoel} />
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
