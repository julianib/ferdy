import React from "react";
import { Link, BrowserRouter } from "react-router-dom";
import Button from "@mui/material/Button";

const LinkBehavior = React.forwardRef((props, ref) => (
  <Link ref={ref} to="/users" {...props} role={undefined} />
));

export default function NavButtons({ children }) {
  return (
    <BrowserRouter>
      <Button
        component={Link}
        to="/test"
        sx={{ my: 2, color: "primary.contrastText", display: "block" }}
      >
        With prop forwarding
      </Button>
      <Button
        component={LinkBehavior}
        sx={{ my: 2, color: "primary.contrastText", display: "block" }}
      >
        With inlining
      </Button>
    </BrowserRouter>
  );
}
