import { Container } from "@mui/material";
import ConnectionToast from "./components/ConnectionToast";
import MainAppBar from "./components/MainAppBar";
import MainTabMenu from "./components/MainTabMenu";

export default function App() {
  return (
    <>
      <MainAppBar />
      <Container
        sx={{
          // offset from appbar
          // todo <=300px suddenly makes the appbar 8px taller?
          mt: {
            xs: 6,
            sm: 8,
          },
        }}
      >
        <MainTabMenu />
      </Container>
      <ConnectionToast />
    </>
  );
}
