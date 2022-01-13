import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import sendPacket from "../utils/sendPacket";

export default function PollsCreate() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [allowMultipleChoices, setAllowMultipleChoices] = useState(false);
  const [allowResubmit, setAllowResubmit] = useState(true);
  const [requireLoggedIn, setRequireLoggedIn] = useState(true);

  function onClickCreate() {
    sendPacket("poll.create", {
      body,
      title,
      allow_multiple_choices: allowMultipleChoices,
    });
  }

  return (
    <Paper sx={{ mt: 1, p: 1 }} variant="outlined">
      <Typography>Create poll</Typography>
      <FormGroup sx={{ maxWidth: 300 }}>
        <TextField
          sx={{ mt: 1 }}
          size="small"
          label="Title"
          autoComplete="off"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <TextField
          sx={{ mt: 1 }}
          multiline
          size="small"
          label="Body"
          autoComplete="off"
          value={body}
          onChange={(ev) => setBody(ev.target.value)}
        />
        <FormControlLabel
          label="Allow multiple choices"
          control={
            <Checkbox
              checked={allowMultipleChoices}
              onChange={() => setAllowMultipleChoices(!allowMultipleChoices)}
            />
          }
        />
        <FormControlLabel
          label="Allow resubmit"
          control={
            <Checkbox
              disabled
              checked={allowResubmit}
              onChange={() => setAllowResubmit(!allowResubmit)}
            />
          }
        />
        <FormControlLabel
          label="Require logged in"
          control={
            <Checkbox
              disabled
              checked={requireLoggedIn}
              onChange={() => setRequireLoggedIn(!requireLoggedIn)}
            />
          }
        />
        <Button color="success" variant="outlined" onClick={onClickCreate}>
          Create
        </Button>
      </FormGroup>
    </Paper>
  );
}
