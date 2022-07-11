import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import sendPacket from "../utils/sendPacket";
import usePacket from "../hooks/usePacket";
import Smoel from "../components/Smoel";
import { getLaplaceScore } from "../utils/laplace";

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
    setSmoelen(content.data.sort(sortByLaplace));
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
