import HomeIcon from "@mui/icons-material/Home";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PeopleIcon from "@mui/icons-material/People";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import { Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import useTabsValue from "../hooks/useTabsValue";
import onCustomTabFocus from "../utils/onCustomTabFocus";

export default function TabsRoot() {
  const tabsValue = useTabsValue(0);

  // todo more DRY: make a component for cleaner Tab with Link component
  return (
    <Tabs
      sx={{ borderBottom: 1, borderColor: "divider" }}
      variant="scrollable"
      value={tabsValue}
    >
      <Tab
        label="Home"
        value="/"
        to="/"
        icon={<HomeIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Accies"
        value="/accies"
        to="/accies"
        icon={<SportsBarIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Polls"
        value="/polls"
        to="/polls"
        icon={<HowToVoteIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Profiles"
        value="/profiles"
        to="/profiles"
        icon={<PeopleIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
    </Tabs>
  );
}
