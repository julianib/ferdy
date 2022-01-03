import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UsersAllPage from "../pages/UsersAllPage";
import CustomTabPanel from "./CustomTabPanel";

export default function TabMenuUsers() {
  const [selectedUsersTab, setSelectedUsersTab] = useState(0);

  function onChangeTab(_event, newValue) {
    setSelectedUsersTab(newValue);
  }

  return (
    <>
      <Tabs
        sx={{ borderBottom: 1, borderColor: "divider" }}
        value={selectedUsersTab}
        onChange={onChangeTab}
        selectionFollowsFocus
        variant="scrollable"
      >
        <Tab label="List" icon={<PeopleIcon />} iconPosition="start" />
        <Tab label="Pending" icon={<PersonAddIcon />} iconPosition="start" />
        <Tab label="Item 2" />
        <Tab label="Item 3" />
        <Tab label="Item 4" />
        <Tab label="Item 5" />
        <Tab label="Item 6" />
      </Tabs>
      <CustomTabPanel current={selectedUsersTab} index={0}>
        <UsersAllPage />
      </CustomTabPanel>
      {selectedUsersTab === 1 && "Item 1"}
      {selectedUsersTab === 2 && "Item 2"}
      {selectedUsersTab === 3 && "Item 3"}
      {selectedUsersTab === 4 && "Item 4"}
      {selectedUsersTab === 5 && "Item 5"}
      {selectedUsersTab === 6 && "Item 6"}
    </>
  );
}
