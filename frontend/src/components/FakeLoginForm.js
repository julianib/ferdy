import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import sendPacket from "../utils/sendPacket";

export default function FakeLoginForm() {
  const [googleId, setGoogleId] = useState("");

  function onChangeId(event) {
    setGoogleId(event.target.value);
  }

  function onClickLogin() {
    sendPacket("user.log_in", {
      fake: true,
      google_id: googleId,
    });
  }

  return (
    <Box sx={{ mt: 1 }}>
      <TextField placeholder="Fake ID" size="small" onChange={onChangeId} />
      <Button sx={{ ml: 1 }} variant="outlined" onClick={onClickLogin}>
        Fake ID log in
      </Button>
    </Box>
  );
}
