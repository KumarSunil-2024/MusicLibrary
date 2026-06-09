import { useState, useEffect } from "react";
import { io } from "socket.io-client"; 
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Logout, LibraryMusic, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Checks if the screen size is a phone layout
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  // Read user role safely from storage
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAdmin = currentUser?.role === "ADMIN";

  // Fetch notifications from the database
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

  useEffect(() => {
    // If Admin, don't do anything
    if (isAdmin) return; 

    // 1. Get old data
    fetchNotifications();

    // 2. Open live connection
    const socket = io("http://localhost:5000");

    socket.on("new_song_notification", (incomingAlert) => {
      if (incomingAlert?.message) {
        // Add new alert to the list
        setNotifications((prevList) => [incomingAlert, ...prevList]);
      }
    });

    // Close connection when leaving page
    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const logout = () => {
    localStorage.clear(); // Clear storage items
    navigate("/"); // Go back to login page
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        
        {/* LEFT SIDE: LOGO & TITLE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LibraryMusic sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {isMobile ? "Library" : "Music Library"}
          </Typography>
        </Box>

        {/* RIGHT SIDE: CONTROLS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Badge badgeContent={isAdmin ? 0 : notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Button 
            color="inherit" 
            onClick={logout} 
            startIcon={<Logout />}
          >
            {isMobile ? "" : "Logout"}
          </Button>
        </Box>

        {/* DROPDOWN MENU */}
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