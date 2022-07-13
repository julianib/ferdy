import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";

export default function SmoelComments({ smoel }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  function onSubmitComment(event) {
    event.preventDefault();
    sendPacket("smoel.comment", {
      smoel_id: smoel.id,
      text: commentText,
    });
    setCommentText("");
  }

  usePacket("smoel.comments.list", (content) => {
    if (content.smoel_id === smoel.id) {
      setComments(content.data);
    }
  });

  useEffect(() => {
    sendPacket("smoel.comments.list", {
      smoel_id: smoel.id,
    });
  });

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
      {comments.map((comment, i) => (
        <Typography key={i}>
          {comment.profile_id}: {comment.text}
        </Typography>
      ))}
    </>
  );
}
