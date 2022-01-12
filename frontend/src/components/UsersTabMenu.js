import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import PendingProfilesPage from "../pages/PendingProfilesPage";
import ProfileListPage from "../pages/ProfileListPage";
import RolesPage from "../pages/RolesPage";
import CustomTabPanel from "./CustomTabPanel";

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
        <Tab label="List" icon={<PeopleIcon />} />
        <Tab label="Pending" icon={<PersonAddIcon />} />
        <Tab label="Roles" icon={<ToggleOnOutlinedIcon />} />
      </Tabs>
      <CustomTabPanel current={selectedUsersTab} index={0}>
        <ProfileListPage />
      </CustomTabPanel>
      <CustomTabPanel current={selectedUsersTab} index={1}>
        <PendingProfilesPage />
      </CustomTabPanel>
      <CustomTabPanel current={selectedUsersTab} index={2}>
        <RolesPage />
      </CustomTabPanel>
    </>
  );
}
