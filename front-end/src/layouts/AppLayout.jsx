import * as React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PeopleIcon from "@mui/icons-material/People";
import SportsSoccer from "@mui/icons-material/SportsSoccer";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { getTheme } from "../theme/theme";
import BackToTop from "../components/BackToTop";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = React.useState(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return savedMode || "light";
  });

  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", newMode);
      return newMode;
    });
  };

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleProfileMenuOpen = (event) =>
    setProfileMenuAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  }

  const isPageAfterLogin = location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/forgot_password";
  const isHomePage = location.pathname === "/home";

  const gradient =
    mode === "light"
      ? "radial-gradient(ellipse at 50% 40%, hsl(210,100%,97%), white)"
      : "radial-gradient(ellipse at 50% 40%, hsl(210,60%,15%), hsl(220,30%,5%))";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Stack sx={{ minHeight: "100vh", width: "100%", background: gradient }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            py: 4,
          }}
        >
          <Box
            component="img"
            sx={{ height: 60, width: "auto" }}
            alt="Icon Left"
            src="../src/assets/SoccerBall.png"
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            Pocket Players
          </Typography>

          <Box
            component="img"
            sx={{ height: 60, width: "auto" }}
            alt="Icon Right"
            src="../src/assets/SoccerBall.png"
          />
        </Box>

        {isPageAfterLogin && (
          <AppBar
          position="static"
          elevation={0}
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
          <Toolbar>
            <Box sx={{ display: "flex", flex: 1 }}>
              <Button
                sx={{ mr: 2 }}
                color="inherit"
                startIcon={<SportsSoccer />}
                onClick={() => navigate("/home")}
              >
                Home
              </Button>
              <Button
                sx={{ mr: 2 }}
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => navigate("/community")}
              >
                Community
              </Button>
              
              {isHomePage && (
                <Button
                  color="inherit"
                  startIcon={<LibraryBooksIcon />}
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("openPack", {
                        detail: { packSize: 5, packCost: 0 },
                      })
                    );
                  }}
                >
                  Open Pack
                </Button>
              )}
            </Box>

              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                Total Funds
                <br />
                {user ? user.currency : 0}
              </Typography>

            <Box>
              <Button
                color="inherit"
                onClick={handleProfileMenuOpen}
                startIcon={<AccountCircle />}
              >
                {user ? user.username : "Loading..."}
              </Button>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfileMenuClose}>
                  Profile Page
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleAdminClick}>Admin</MenuItem>
              </Menu>
            </Box>

            <IconButton onClick={toggleTheme} sx={{ ml: 2 }}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        )}

        <Box sx={{ flex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
          <Outlet context={{ user, setUser }} />
        </Box>

        <BackToTop />
      </Stack>
    </ThemeProvider>
  );
}