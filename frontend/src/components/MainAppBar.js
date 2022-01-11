import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
  AppBar,
  Box, Container, IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import OnlineUsersIconButton from "./OnlineUsersIconButton";
import ProfileIconButton from "./ProfileIconButton";

export default function MainAppBar() {
  return (
    <AppBar
      sx={{ backgroundImage: "none" }}
      position="static"
      enableColorOnDark
    >
      <Container>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <IconButton
              sx={{ mr: 2 }}
              size="large"
              edge="start"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              sx={{ display: { xs: "none", sm: "inline" } }}
              variant="h6"
              noWrap
            >
              Ferdy
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <OnlineUsersIconButton />
              <ProfileIconButton />
            </Box>

            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <IconButton color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
