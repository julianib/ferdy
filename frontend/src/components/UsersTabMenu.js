import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import CustomTabPanel from "./CustomTabPanel";
import AllUsersPage from "../pages/AllUsersPage";
import RolesPage from "../pages/RolesPage";

export default function UsersTabMenu() {
  const [selectedUsersTab, setSelectedUsersTab] = useState(0);

  function onChangeTab(_event, newValue) {
    setSelectedUsersTab(newValue);
  }

  return (
    <>
      <Tabs
        sx={{ borderBottom: 1, borderColor: "divider" }}
        variant="scrollable"
        value={selectedUsersTab}
        onChange={onChangeTab}
        selectionFollowsFocus
      >
        <Tab label="All" icon={<PeopleIcon />} />
        <Tab label="Pending" icon={<PersonAddIcon />} />
        <Tab label="Roles" icon={<ToggleOnOutlinedIcon />} />
      </Tabs>
      <CustomTabPanel current={selectedUsersTab} index={0}>
        <AllUsersPage />
      </CustomTabPanel>
      {selectedUsersTab === 1 && "Item 1"}
      <CustomTabPanel current={selectedUsersTab} index={2}>
        <RolesPage />
      </CustomTabPanel>
    </>
  );
}
