import { Container } from "@mui/material";
import Toast from "./components/Toast";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";
import LoginOrLogoutButton from "./components/LoginOrLogoutButton";

export default function App() {
  return (
    <>
      <MainAppBar />
      <Container>
        <MainTabMenu />
        <br />
        <LoginOrLogoutButton />
      </Container>
      <Toast />
    </>
  );
}
