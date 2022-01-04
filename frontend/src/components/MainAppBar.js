import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import OnlineUsersIconButton from "./OnlineUsersIconButton";
import ProfileIconButton from "./ProfileIconButton";

export default function MainAppBar() {
  return (
    <AppBar
      sx={{
        backgroundImage: "none",
      }}
      position="static"
      enableColorOnDark
    >
      <Container>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Ferdy
          </Typography>

          <Box
            // fills the space between left and right side
            sx={{ flexGrow: 1 }}
          />

          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <OnlineUsersIconButton />

            <ProfileIconButton />
          </Box>

          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
