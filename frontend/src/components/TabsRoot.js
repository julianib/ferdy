import ChatIcon from "@mui/icons-material/Chat";
import FaceIcon from "@mui/icons-material/Face";
import HomeIcon from "@mui/icons-material/Home";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PeopleIcon from "@mui/icons-material/People";
// import SettingsIcon from "@mui/icons-material/Settings";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Link } from "react-router-dom";
import useTabsValue from "../hooks/useTabsValue";
import onTabFocus from "../utils/onTabFocus";

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
        onFocus={onTabFocus}
        component={Link}
      />
      <Tab
        label="Accies"
        value="/accies"
        to="/accies"
        icon={<SportsBarIcon />}
        onFocus={onTabFocus}
        component={Link}
      />
      <Tab
        label="Chat"
        value="/chat"
        to="/chat"
        icon={<ChatIcon />}
        onFocus={onTabFocus}
        component={Link}
      />
      <Tab
        label="Polls"
        value="/polls"
        to="/polls"
        icon={<HowToVoteIcon />}
        onFocus={onTabFocus}
        component={Link}
      />
      <Tab
        label="Profiles"
        value="/profiles"
        to="/profiles"
        icon={<PeopleIcon />}
        onFocus={onTabFocus}
        component={Link}
      />
      {/* <Tab
        label="Settings"
        value="/settings"
        to="/settings"
        icon={<SettingsIcon />}
        onFocus={onTabFocus}
        component={Link}
      /> */}
      <Tab
        label="Smoelenboek"
        value="/smoelenboek"
        to="/smoelenboek"
        icon={<FaceIcon />}
        onFocus={onTabFocus}
        component={Link}
      />
    </Tabs>
  );
}
