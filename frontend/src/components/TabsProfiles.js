import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import useTabsValue from "../hooks/useTabsValue";
import onCustomTabFocus from "../utils/onCustomTabFocus";

export default function TabsProfiles() {
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
        to="/profiles"
        icon={<PeopleIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Pending"
        value="/pending"
        to="/profiles/pending"
        icon={<PersonAddIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
      <Tab
        label="Roles"
        value="/roles"
        to="/profiles/roles"
        icon={<ToggleOnOutlinedIcon />}
        onFocus={onCustomTabFocus}
        component={Link}
      />
    </Tabs>
  );
}
