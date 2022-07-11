import { Paper, Button, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { BACKEND } from "../utils/backend";
import useProfile from "../hooks/useProfile";
import sendPacket from "../utils/sendPacket"

export default function Smoel({ smoel }) {
  const { profile } = useProfile();

  function getDislikeCount(smoel) {
    return smoel.votes.filter((vote) => !vote.is_like).length;
  }

  function getLikeCount(smoel) {
    return smoel.votes.filter((vote) => vote.is_like).length;
  }

  function getLikePercentage(smoel) {
    const voteCount = getVoteCount(smoel);
    if (voteCount === 0) {
      return 0;
    }

    const ratio = getLikeCount(smoel) / voteCount;
    return Math.round(ratio * 100);
  }

  function getVoteCount(smoel) {
    return smoel.votes.length;
  }

  function hasDisliked(smoel) {
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

  function hasLiked(smoel) {
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

  function onClickVote(id, is_like) {
    sendPacket("smoel.vote", {
      id,
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
        variant={hasLiked(smoel) ? "contained" : "outlined"}
        color="success"
        startIcon={<ThumbUpIcon />}
        onClick={() => onClickVote(smoel.id, true)}
      >
        {getLikeCount(smoel)}
      </Button>
      <Button
        variant={hasDisliked(smoel) ? "contained" : "outlined"}
        color="error"
        startIcon={<ThumbDownIcon />}
        onClick={() => onClickVote(smoel.id, false)}
      >
        {getDislikeCount(smoel)}
      </Button>
      <Typography>{`${getLikePercentage(smoel)}%`}</Typography>
    </Paper>
  );
}
