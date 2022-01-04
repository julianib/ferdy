import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import CustomTabPanel from "./CustomTabPanel";
import ProfileListPage from "../pages/ProfileListPage";
import UserRolesPage from "../pages/UserRolesPage";
import PendingUsersPage from "../pages/PendingUsersPage";

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
        <PendingUsersPage />
      </CustomTabPanel>
      <CustomTabPanel current={selectedUsersTab} index={2}>
        <UserRolesPage />
      </CustomTabPanel>
    </>
  );
}
