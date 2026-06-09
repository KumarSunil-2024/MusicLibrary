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

  useEffect(() => {
    fetchNotifications();

    // 🎯 OPTIMIZATION: Keeps a single socket pipeline alive instead of creating duplicates
    const socket = io("http://localhost:5000", {
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("🟢 Frontend successfully wired into live websocket stream!");
    });

    socket.on("new_song_notification", (incomingAlert) => {
      console.log("🔔 Socket caught real-time alert event data:", incomingAlert);
      
      if (incomingAlert?.message) {
        setNotifications((prevList) => {
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
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🎯 OPTIMIZATION: Defensive validation prevents mapping on non-array results
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error("🚨 Failed to download notification index:", error.message);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 🎯 BUG FIX: Clears local notifications array when the panel dropdown gets dismissed
  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Badge badgeContent={notifications.length} color="error">
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

          {notifications.length === 0 ? (
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