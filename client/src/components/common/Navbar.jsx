import { useState, useEffect } from "react";
import { io } from "socket.io-client"; 
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Logout, LibraryMusic, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  // NAVIGATION AND STYLING HOOKS
  const navigate = useNavigate();
  const theme = useTheme();
  
  // MOBILE RESPONSIVENESS MEDIA QUERY
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  
  // COMPONENT REACT STATE VARIABLES
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  // USER ACCESS ROLE CHECKING
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAdmin = currentUser?.role === "ADMIN";

  // FETCH OLD NOTIFICATIONS DATABASE
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
  };

  // SOCKET REALTIME LISTENERS MANAGEMENT
  useEffect(() => {
    if (isAdmin) return; 

    fetchNotifications();

    // CONNECT WEBSOCKET SERVER INSTANCE
    const socket = io("http://localhost:5000");

    // RECEIVE NEW SONGS NOTIFICATION
    socket.on("new_song_notification", (incomingAlert) => {
      if (incomingAlert?.message) {
        setNotifications((prevList) => [incomingAlert, ...prevList]);
      }
    });

    // CLEANUP DISCONNECT WEBSOCKET CONNECTION
    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  // TOGGLE NOTIFICATION DROPDOWN MENU
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // CLEAR LOGGED USER SESSION
  const logout = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

  return (
    // HEADER APPLICATION TOP BAR
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        
        {/* APP BRAND LOGO UI */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LibraryMusic sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {isMobile ? "Library" : "Music Library"}
          </Typography>
        </Box>

        {/* RIGHT CONTROLS BUTTON GROUP */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* NOTIFICATION BADGE BUTTON CLICKABLE */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Badge badgeContent={isAdmin ? 0 : notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* APPLICATION USER LOGOUT BUTTON */}
          <Button 
            color="inherit" 
            onClick={logout} 
            startIcon={<Logout />}
          >
            {isMobile ? "" : "Logout"}
          </Button>
        </Box>

        {/* DROPDOWN NOTIFICATIONS DISPLAY LIST */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{ sx: { width: isMobile ? "90vw" : 320, maxHeight: 400 } }}
        >
          <Typography sx={{ p: 2, fontWeight: "bold" }} variant="subtitle1">
            Recent Announcements
          </Typography>
          <Divider />
          
          {/* CONDITIONALLY RENDER ALERTS CONTENT */}
          {isAdmin || notifications.length === 0 ? (
            <MenuItem onClick={handleMenuClose} sx={{ color: "gray", py: 2 }}>
              No new songs added.
            </MenuItem>
          ) : (
            notifications.map((notif, index) => (
              <MenuItem key={index} onClick={handleMenuClose} sx={{ whiteSpace: "normal" }}>
                {notif.message}
              </MenuItem>
            ))
          )}
        </Menu>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;