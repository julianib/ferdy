import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import { useContext } from "react";
import { OnlineUsersContext } from "../contexts/OnlineUsersContext";
import { ProfileContext } from "../contexts/ProfileContext";

export default function MainAppBar() {
  const { profile } = useContext(ProfileContext);
  const { userCount } = useContext(OnlineUsersContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          backgroundImage: "none",
        }}
        position="static"
        enableColorOnDark
      >
        <Container>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
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

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={userCount} color="secondary">
                  <PeopleIcon />
                </Badge>
              </IconButton>
              <IconButton edge="end" color="inherit">
                {profile ? (
                  <Tooltip title={`Logged in as ${profile.name}`}>
                    <Avatar src={profile.avatar_url} />
                  </Tooltip>
                ) : (
                  <Tooltip title="Not logged in">
                    <Avatar />
                  </Tooltip>
                )}
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
