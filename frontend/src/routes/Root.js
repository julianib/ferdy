import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import MainAppBar from "../components/MainAppBar";
import TabsRoot from "../components/TabsRoot";
import LoginOrLogoutButton from "../components/LoginOrLogoutButton";
import Toast from "../components/Toast";
import ScrollToTop from "../components/ScrollToTop";

export default function Root() {
  return (
    <>
      <ScrollToTop />
      <MainAppBar />
      <Container sx={{ mb: 20 }}>
        <TabsRoot />
        <Outlet />
        <br />
        <LoginOrLogoutButton />
      </Container>
      <Toast />
    </>
  );
}
