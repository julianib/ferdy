import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import NavButtons from "./.NavButtons";

const navPages = ["Page"];
const userPages = ["Profile"];
const navTitle = "Ferdy";

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  function onOpenNavMenu(event) {
    setAnchorElNav(event.currentTarget);
  }

  function onCloseNavMenu() {
    setAnchorElNav(null);
  }

  function onOpenUserMenu(event) {
    setAnchorElUser(event.currentTarget);
  }

  function onCloseUserMenu() {
    setAnchorElUser(null);
  }

  return (
    <AppBar enableColorOnDark>
      <Container>
        <Toolbar>
          <Box
            // nav popup menu
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton size="large" onClick={onOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={onCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navPages.map((page) => (
                <MenuItem key={page} onClick={onCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <img
            component="div"
            src="logo-400-black-trans.png"
            width={50}
            sx={{
              flexGrow: 1,
            }}
            alt=""
          />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              ml: 2,
              display: { xs: "flex", md: "none" },
            }}
          >
            {navTitle}
          </Typography>

          <Box
            // main nav menu
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            {navPages.map((page) => (
              <Button key={page} onClick={onCloseNavMenu}>
                {page}
              </Button>
            ))}
          </Box>

          <Box
            // open user menu
            sx={{ flexGrow: 0 }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={onOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={onCloseUserMenu}
            >
              {userPages.map((setting) => (
                <MenuItem key={setting} onClick={onCloseNavMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <NavButtons />
    </AppBar>
  );
}
