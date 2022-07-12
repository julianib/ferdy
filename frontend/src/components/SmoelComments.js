import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import sendPacket from "../utils/sendPacket";

export default function SmoelComments({ smoel }) {
  const [commentText, setCommentText] = useState("");

  function onSubmitComment(event) {
    event.preventDefault();
    sendPacket("smoel.comment", {
      smoel_id: smoel.id,
      text: commentText,
    });
    setCommentText("");
  }

  return (
    <>
      <Paper variant="outlined">
        <form onSubmit={onSubmitComment}>
          <TextField
            fullWidth
            label="New comment"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <Button type="submit" disabled={!commentText} variant="contained">
            Comment
          </Button>
        </form>
      </Paper>
      {smoel.comments.map((comment, i) => (
        <Typography key={i}>
          {comment.profile_id}: {comment.text}
        </Typography>
      ))}
    </>
  );
}
