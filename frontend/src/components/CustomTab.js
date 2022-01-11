import { Tab } from "@mui/material";
import { Link } from "react-router-dom";
import onCustomTabFocus from "../utils/onCustomTabFocus";

// todo currently broken
// this doesn't work as MUI doesn't apply "active" orange css color
export default function CustomTab({ label, page, ...other }) {
  return (
    <Tab
      label={label}
      to={page}
      value={page}
      component={Link}
      onFocus={onCustomTabFocus}
      {...other}
    />
  );
}
