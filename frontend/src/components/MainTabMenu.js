import Tabs from "@mui/material/Tabs";
import PeopleIcon from "@mui/icons-material/People";
import UsersTabMenu from "./UsersTabMenu";
import HomePage from "../pages/HomePage";
import useRouteMatch from "../hooks/useRouteMatch";
import { Link, Route, Routes } from "react-router-dom";
import { Tab } from "@mui/material";
import { onCustomTabFocus } from "../utils/onCustomTabFocus";

export default function MainTabMenu() {
  // the order should be ['users/add', 'users/edit', 'users'].
  const selectedMainTab = useRouteMatch(["/", "/users"]);

  return (
    <>
      <Tabs
        // todo Tabs with router is sometimes laggy
        sx={{ borderBottom: 1, borderColor: "divider" }}
        value={selectedMainTab}
        variant="scrollable"
      >
        <Tab
          // todo implement CustomTab component to be DRY
          label="Home"
          value="/"
          to="/"
          onFocus={onCustomTabFocus}
          component={Link}
        />
        <Tab
          label="Users"
          value="/users"
          to="/users"
          icon={<PeopleIcon />}
          iconPosition="start"
          onFocus={onCustomTabFocus}
          component={Link}
        />
      </Tabs>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersTabMenu />} />
      </Routes>
    </>
  );
}
