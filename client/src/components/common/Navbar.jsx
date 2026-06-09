import { useState, useEffect } from "react";
import { io } from "socket.io-client"; 
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Divider } from "@mui/material";
import { Logout, LibraryMusic, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  // 🎯 ROLE CHECK: Read credentials safely from local storage context
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    // 🎯 BLOCK 1: If the user is an admin, do not fetch previous notifications from database
    if (isAdmin) return;

    fetchNotifications();

    const socket = io("http://localhost:5000", {
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("🟢 Frontend successfully wired into live websocket stream!");
    });

    socket.on("new_song_notification", (incomingAlert) => {
      // 🎯 BLOCK 2: If the live logged-in user is an admin, ignore the incoming real-time socket alert
      if (isAdmin) return;

      console.log("🔔 Socket caught real-time alert event data:", incomingAlert);
      
      if (incomingAlert?.message) {
        setNotifications((prevList) => {
          const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
          if (dismissedIds.includes(incomingAlert._id)) return prevList;

          const exists = prevList.some(item => item._id === incomingAlert._id);
          if (exists) return prevList;
          return [incomingAlert, ...prevList];
        });
      }
    });

    return () => {
      socket.off("new_song_notification");
      socket.disconnect();
    };
  }, [isAdmin]); // Added dependency to re-run safely if login roles swap contexts

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
        const activeNotifications = res.data.filter(notif => !dismissedIds.includes(notif._id));
        setNotifications(activeNotifications);
      }
    } catch (error) {
      console.error("🚨 Failed to download notification index:", error.message);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);

    if (notifications.length > 0) {
      const currentIds = notifications.map(n => n._id).filter(Boolean);
      const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
      
      const updatedDismissed = [...new Set([...dismissedIds, ...currentIds])];
      localStorage.setItem("dismissedNotifications", JSON.stringify(updatedDismissed));
    }

    setNotifications([]); 
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <LibraryMusic sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Music Library
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* 🎯 UI HIDDEN/ZERO STATE: If an Admin logs in, the badge stays locked at 0 */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Badge badgeContent={isAdmin ? 0 : notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            Logout
          </Button>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400, mt: 1.5 },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Typography sx={{ p: 2, fontWeight: "bold" }} variant="subtitle1">
            Recent Announcements
          </Typography>
          <Divider />

          {/* If Admin opens the panel or there are no items, show the clean empty state layout */}
          {isAdmin || notifications.length === 0 ? (
            <MenuItem onClick={handleMenuClose} sx={{ color: "gray", fontSize: "0.9rem", py: 2 }}>
              No new songs added recently.
            </MenuItem>
          ) : (
            notifications.map((notif) => (
              <MenuItem 
                key={notif._id || Math.random()} 
                onClick={handleMenuClose}
                sx={{ whiteSpace: "normal", py: 1.5, fontSize: "0.85rem" }}
              >
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