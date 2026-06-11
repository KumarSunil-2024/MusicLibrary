import { useEffect, useState } from "react";
import { io } from "socket.io-client"; 
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Logout, LibraryMusic, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  // NAVIGATION ROUTING HOOK INSTANCES
  const navigate = useNavigate();
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm")); 
  
  // COMPONENT ACTIVE STORAGE STATES
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); 

  // USER ACCESS PRIVILEGES CHECK
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const isAdmin = user?.role === "ADMIN";

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
        setUnreadCount(res.data.length); // INITIALIZE BADGE VALUE
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // MANAGEMENT OF LIVE LISTENER CONNECTIONS
  useEffect(() => {
    if (isAdmin) return; 
    fetchNotifications();

    const socket = io("http://localhost:5000");
    socket.on("new_song_notification", (alertItem) => {
      if (alertItem?.message) {
        setNotifications((prev) => [alertItem, ...prev]);
        setUnreadCount((c) => c + 1); // INCREMENT UNREAD BADGES
      }
    });

    return () => socket.disconnect();
  }, [isAdmin]);

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
          <Typography variant="h6">{isMobile ? "Library" : "Music Library"}</Typography>
        </Box>

        {/* SYSTEM CONTROL NAVIGATION LINKS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" onClick={(e) => { setAnchorEl(e.currentTarget); setUnreadCount(0); }}>
            <Badge badgeContent={isAdmin ? 0 : unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            {isMobile ? "" : "Logout"}
          </Button>
        </Box>

        {/* NOTIFICATION FEED DROPDOWN OVERLAY */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { width: isMobile ? "90vw" : 320, maxHeight: 400 } }}
        >
          <Typography sx={{ p: 2, fontWeight: "bold" }} variant="subtitle1">Recent Announcements</Typography>
          <Divider />
          
          {/* CONDITIONALLY CHOOSE RENDERING STATE */}
          {isAdmin || notifications.length === 0 ? (
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: "gray", py: 2 }}>No new songs added.</MenuItem>
          ) : (
            notifications.map((notif, idx) => (
              <MenuItem key={notif._id || idx} onClick={() => setAnchorEl(null)} sx={{ whiteSpace: "normal" }}>
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