import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import Smoel from "../components/Smoel";
import SmoelPreview from "../components/SmoelPreview";
import { getLaplaceScore } from "../utils/laplace";

export default function Smoelenboek() {
  const [selectedSmoel, setSelectedSmoel] = useState();
  const [smoelen, setSmoelen] = useState([]);
  const [smoelComments, setSmoelComments] = useState([]);
  const [smoelRatings, setSmoelRatings] = useState([]);

  function onClickSmoel(smoel) {
    setSelectedSmoel(smoel);
  }

  function onClickSortByLaplace() {
    const test = smoelen.slice();

    smoelRatings.forEach((rating) => {
      const smoelId = rating.smoel_id
      newSmoelen.find((smoel) => smoel.id === smoelId)
    })
    newSmoelen.sort(sortByLaplace);
    setSmoelen(newSmoelen);
  }

  function onClickSortByName() {
    const newSmoelen = smoelen.slice();
    newSmoelen.sort(sortByName);
    setSmoelen(newSmoelen);
  }

  function sortByLaplace(a, b) {
    // sort based on rating. if equal rating, sort based on name
    // return -1 if a BEFORE b, 1 if a AFTER b, 0 if a === b
    // source: https://en.wikipedia.org/wiki/Rule_of_succession

    const aScore = getLaplaceScore(a);
    const bScore = getLaplaceScore(b);

    if (aScore > bScore) return -1; // sort a before b
    if (aScore < bScore) return 1; // sort a after b

    // if tied: sort alphabetically: "abc" before "xyz"
    return sortByName(a, b);
  }

  function sortByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  usePacket("smoel.list", (content) => {
    // todo select sorting method with radio buttons
    setSmoelen(content.data.sort(sortByLaplace));
    setSelectedSmoel((oldSelectedSmoel) => {
      console.log("received sm list, selected:", oldSelectedSmoel);
      if (!oldSelectedSmoel) return;
      console.log("Updating selected smoel");

      return content.data.find((smoel) => oldSelectedSmoel.id === smoel.id);
    });
  });

  usePacket("smoel.ratings.list", (content) => {
    setSmoelRatings(content.data);
  });

  useEffect(() => {
    sendPacket("smoel.list");
    sendPacket("smoel.ratings.list");
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
          sendPacket("smoel.comments.list");
          sendPacket("smoel.ratings.list");
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

      {selectedSmoel && <SmoelPreview smoel={selectedSmoel} />}

      <Grid container sx={{ mt: 0 }} spacing={1}>
        {smoelen.length ? (
          smoelen.map((smoel) => (
            <Grid item xs={3} key={smoel.id}>
              <Smoel smoel={smoel} onClickSmoel={onClickSmoel} />
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
