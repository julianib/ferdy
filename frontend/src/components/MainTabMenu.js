import PeopleIcon from "@mui/icons-material/People";
import { Tab, Tabs } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import useRouteMatch from "../hooks/useRouteMatch";
import HomePage from "../pages/HomePage";
import onCustomTabFocus from "../utils/onCustomTabFocus";
import UsersTabMenu from "./UsersTabMenu";

export default function MainTabMenu() {
  const selectedMainTab = useRouteMatch(["/", "/users"]);

  return (
    <>
      <Tabs
        sx={{ borderBottom: 1, borderColor: "divider" }}
        variant="scrollable"
        value={selectedMainTab}
      >
        <Tab
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
