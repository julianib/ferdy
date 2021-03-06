import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GitHubIconButton from "./GitHubIconButton";
import OnlineUsersIconButton from "./OnlineUsersIconButton";
import ProfileIconButton from "./ProfileIconButton";
import TrelloIconButton from "./TrelloIconButton";
import WriteDataToDiskButton from "./WriteDataToDiskButton";

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
              <WriteDataToDiskButton />
              <GitHubIconButton />
              <TrelloIconButton />
              {/* todo tooltip of these buttons moves slightly after hovering?? */}
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
