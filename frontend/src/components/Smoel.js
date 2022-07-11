import { Paper, Button, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { BACKEND } from "../utils/backend";
import useProfile from "../hooks/useProfile";
import sendPacket from "../utils/sendPacket";

export default function Smoel({ smoel }) {
  const { profile } = useProfile();

  function getDislikeCount() {
    return smoel.votes.filter((vote) => !vote.is_like).length;
  }

  function getLikeCount() {
    return smoel.votes.filter((vote) => vote.is_like).length;
  }

  function getLikePercentage() {
    const voteCount = getVoteCount();
    if (voteCount === 0) {
      return 0;
    }

    const ratio = getLikeCount() / voteCount;
    return Math.round(ratio * 100);
  }

  function getVoteCount() {
    return smoel.votes.length;
  }

  function hasDisliked() {
    if (!profile) {
      return false;
    }

    if (
      smoel.votes.find(
        (vote) => !vote.is_like && vote.profile_id === profile.id
      )
    ) {
      return true;
    }

    return false;
  }

  function hasLiked() {
    if (!profile) {
      return false;
    }

    if (
      smoel.votes.find((vote) => vote.is_like && vote.profile_id === profile.id)
    ) {
      return true;
    }

    return false;
  }

  function onClickVote(is_like) {
    sendPacket("smoel.vote", {
      id: smoel.id,
      is_like,
    });
  }

  return (
    <Paper sx={{ p: 1 }} variant="outlined">
      <Typography variant="h5">{smoel.name}</Typography>
      <div sx={{ width: "100%" }}>
        {/* todo fix humongous big image ??????????? */}
        <img
          width="100%"
          src={`${BACKEND}/smoelen/${smoel.image_filename}`}
          alt={smoel.name}
        />
      </div>
      <Button
        variant={hasLiked() ? "contained" : "outlined"}
        color="success"
        startIcon={<ThumbUpIcon />}
        onClick={() => onClickVote(true)}
      >
        {getLikeCount()}
      </Button>
      <Button
        variant={hasDisliked() ? "contained" : "outlined"}
        color="error"
        startIcon={<ThumbDownIcon />}
        onClick={() => onClickVote(false)}
      >
        {getDislikeCount()}
      </Button>
      <Typography>{`${getLikePercentage()}%`}</Typography>
      <Typography>{`RoS: ${Math.round(
        ((getLikeCount() + 1) / (getVoteCount() + 2)) * 100
      )}`}</Typography>
    </Paper>
  );
}
