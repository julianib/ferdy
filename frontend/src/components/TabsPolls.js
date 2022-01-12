import AddIcon from "@mui/icons-material/Add";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import useTabsValue from "../hooks/useTabsValue";
import onCustomTabFocus from "../utils/onCustomTabFocus";

export default function TabsPolls() {
  const tabsValue = useTabsValue(1);

  return (
    <Tabs
      sx={{ borderBottom: 1, borderColor: "divider" }}
      variant="scrollable"
      value={tabsValue}
    >
      <Tab
        label="All"
        value="/"
        to="/polls"
        icon={<HowToVoteIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Create"
        value="/create"
        to="/polls/create"
        icon={<AddIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
    </Tabs>
  );
}
