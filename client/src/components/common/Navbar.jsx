import { useState, useEffect } from "react";
import { io } from "socket.io-client"; 
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Logout, LibraryMusic, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  // NAVIGATION ROUTING HOOK INSTANCES
  const navigate = useNavigate();
  const theme = useTheme();
  
  // MOBILE VIEW BREAKPOINT SENSING
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  
  // COMPONENT ACTIVE STORAGE STATES
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  // USER ACCESS PRIVILEGES CHECK
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAdmin = currentUser?.role === "ADMIN";

  // FETCH PERSISTENT ANNOUNCEMENT ARCHIVES
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

  // MANAGEMENT OF LIVE LISTENER CONNECTIONS
  useEffect(() => {
    if (isAdmin) return; 

    fetchNotifications();

    // INITIALIZE WEBSOCKET SERVER STREAM
    const socket = io("http://localhost:5000");

    // RECEIVE RUNTIME EMISSION ALERTS
    socket.on("new_song_notification", (incomingAlert) => {
      if (incomingAlert?.message) {
        setNotifications((prevList) => [incomingAlert, ...prevList]);
      }
    });

    // CLEANUP LIVED SOCKET LIFECYCLE
    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  // OPEN NOTIFICATION MENU ACCORDION
  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // CLOSE MENU CLEAR BADGE
  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotifications([]); 
  };

  // PURGE LOGGED SESSION INSTANCE
  const logout = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        
        {/* BRAND IDENTITY UI FRAME */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LibraryMusic sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {isMobile ? "Library" : "Music Library"}
          </Typography>
        </Box>

        {/* SYSTEM CONTROL NAVIGATION LINKS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* INTERACTIVE NOTIFICATION BADGE CONTROLLER */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Badge badgeContent={isAdmin ? 0 : notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* APPLICATION USER LOGOUT BUTTON */}
          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            {isMobile ? "" : "Logout"}
          </Button>
        </Box>

        {/* NOTIFICATION FEED DROPDOWN OVERLAY */}
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
          
          {/* CONDITIONALLY CHOOSE RENDERING STATE */}
          {isAdmin || notifications.length === 0 ? (
            <MenuItem onClick={handleMenuClose} sx={{ color: "gray", py: 2 }}>
              No new songs added.
            </MenuItem>
          ) : (
            notifications.map((notif, index) => (
              // RENDER SINGLE ALERT ITEM
              <MenuItem key={notif._id || index} onClick={handleMenuClose} sx={{ whiteSpace: "normal" }}>
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