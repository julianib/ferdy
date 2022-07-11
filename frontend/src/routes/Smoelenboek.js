import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import Smoel from "../components/Smoel";

export default function Smoelenboek() {
  const [smoelen, setSmoelen] = useState([]);

  function onClickSortByLaplace() {
    const newSmoelen = smoelen.slice();
    newSmoelen.sort(sortByLaplace);
    setSmoelen(newSmoelen);
  }

  function onClickSortByName() {
    const newSmoelen = smoelen.slice();
    newSmoelen.sort(sortByName);
    setSmoelen(newSmoelen);
  }

  function sortByLaplace(a, b) {
    // sort based on votes. if equal votes, sort based on name
    // return -1 if a before b, 1 if a after b, 0 if a === b
    // source: https://en.wikipedia.org/wiki/Rule_of_succession

    const aLikeCount = a.votes.filter((vote) => vote.is_like).length;
    const aVoteCount = a.votes.length;
    const aLaplaceRating = (aLikeCount + 1) / (aVoteCount + 2);
    const bLikeCount = b.votes.filter((vote) => vote.is_like).length;
    const bVoteCount = b.votes.length;
    const bLaplaceRating = (bLikeCount + 1) / (bVoteCount + 2);

    if (aLaplaceRating > bLaplaceRating) return -1; // sort a before b
    if (aLaplaceRating < bLaplaceRating) return 1; // sort a after b

    // if tied: sort alphabetically: "abc" before "xyz"
    return a.name.localeCompare(b.name);
  }

  function sortByName(a, b) {
    return a.name.localeCompare(b.name);
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
        variant="outlined"
        onClick={() => {
          sendPacket("smoel.generate_missing");
        }}
      >
        Generate missing data
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          sendPacket("smoel.list");
        }}
      >
        Refresh
      </Button>
      <Button variant="outlined" onClick={onClickSortByLaplace}>
        Sort by rating
      </Button>
      <Button variant="outlined" onClick={onClickSortByName}>
        Sort by name
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
