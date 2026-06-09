import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 1. SAFE STORAGE READ (Runs once on mount to prevent rendering mismatches)
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setStoredUser(parsedUser);
        setName(parsedUser?.name || "");
        setPhone(parsedUser?.phone || "");
      } catch (err) {
        console.error("Failed to parse user session:", err);
      }
    }
  }, []);

  // 2. EXPLICIT UPDATE LOGIC WITH VALIDATION
  const updateProfile = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    try {
      const res = await api.put("/auth/profile", { name, phone });
      const updatedData = res.data.user || res.data;

      localStorage.setItem("user", JSON.stringify(updatedData));
      setStoredUser(updatedData);
      alert("Profile Updated");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  // 3. ACCOUNT DELETION & STORAGE FLUSH
  const deleteUser = async () => {
    if (!window.confirm("Delete Account?")) return;

    try {
      await api.delete("/auth/profile");
      localStorage.clear(); // Clear all tokens immediately
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 3, px: { xs: 1, sm: 0 } }}>
        <Card sx={{ borderRadius: "12px", boxShadow: 3 }}>
          <CardContent>
            {/* AVATAR & TITLE HEADER */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mx: "auto",
                  width: 48,
                  height: 48,
                }}
              >
                <Person />
              </Avatar>
              <Typography variant="h5" mt={1} fontWeight="bold">
                User Profile
              </Typography>
            </Box>

            <Divider />

            {/* INPUT FIELDS LIST */}
            <List disablePadding sx={{ my: 1 }}>
              <ListItem disableGutters sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </ListItem>

              <ListItem disableGutters sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={storedUser?.email || ""}
                  disabled
                  variant="outlined"
                  size="small"
                />
              </ListItem>

              <ListItem disableGutters sx={{ py: 1 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </ListItem>

              <ListItem disableGutters sx={{ py: 1 }}>
                <Chip
                  label={storedUser?.role || "USER"}
                  color="primary"
                  variant="combined"
                  fontWeight="bold"
                />
              </ListItem>
            </List>

            {/* ACTION BUTTON CONTAINER - Fully Responsive Layout Shift */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Stacks on phone, row on tablet/desktop
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={updateProfile}
                sx={{ py: 1, fontWeight: "bold" }}
              >
                Update Profile
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={deleteUser}
                sx={{ py: 1, fontWeight: "bold" }}
              >
                Delete User
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile;
