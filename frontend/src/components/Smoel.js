import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { BACKEND } from "../utils/backend";
import sendPacket from "../utils/sendPacket";
import { getTotalStars, getLaplaceScore } from "../utils/laplace";
import useProfile from "../hooks/useProfile";
import { useState } from "react";

export default function Smoel({ smoel }) {
  const { profile } = useProfile();
  const [stars, setStars] = useState(() => getYourRating());

  function getAverageRating() {
    const ratingsCount = getRatingsCount();
    if (!ratingsCount) {
      return;
    }

    const totalStars = getTotalStars(smoel);

    // round to 1 decimal
    const rounded = Math.round((totalStars / ratingsCount) * 10) / 10;
    return rounded;
  }

  function getRatingsCount() {
    return smoel.ratings.length;
  }

  function getRatingsDescription() {
    // ratings count is > 0
    if (getRatingsCount()) {
      return `${getAverageRating()}/5⭐ (${getRatingsCount()})`;
    }

    return "Unrated";
  }

  function getYourRating() {
    const rating = smoel.ratings.find(
      (smoel) => smoel.profile_id === profile.id
    );

    // return null if no rating is found (instead of undefined)
    return rating?.stars || null;
  }

  function onChangeRating(_event, newValue) {
    setStars(newValue);
    sendPacket("smoel.rate", {
      id: smoel.id,
      stars: newValue,
    });
  }

  return (
    <Paper sx={{ p: 1 }} variant="outlined">
      <Typography variant="h5">{smoel.name}</Typography>
      <div sx={{ width: "100%" }}>
        <img
          width="100%"
          src={`${BACKEND}/smoelen/${smoel.image_filename}`}
          alt={smoel.name}
        />
      </div>
      <Rating size="large" value={stars} onChange={onChangeRating} />
      <Typography>{getRatingsDescription()}</Typography>
      <Typography>{`LS: ${getLaplaceScore(smoel, true)}`}</Typography>
    </Paper>
  );
}
