import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Avatar
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!user.name.trim()) {
    setError("Name is required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(user.email)) {
    setError("Invalid email format");
    return;
  }

  if (!/^[0-9]{10}$/.test(user.phone)) {
    setError("Phone number must be 10 digits");
    return;
  }

  if (user.password.length < 6) {
    setError(
      "Password must be at least 6 characters"
    );
    return;
  }

  try {
    await api.post("/auth/register", user);

    alert("Registration Successful");

    navigate("/");
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Registration Failed"
    );
  }
};
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card elevation={2} sx={{ borderRadius: 2, width: "100%", p: 1 }}>
          <CardContent sx={{ '&:last-child': { pb: 1 } }}>
            {/* Minimal Header */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1.5 }}>
              <Avatar sx={{ m: 0.5, bgcolor: "success.main", width: 40, height: 40 }}>
                <PersonAdd fontSize="small" />
              </Avatar>
              <Typography component="h1" variant="h6" fontWeight="bold">
                Create Account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" size="small" sx={{ mb: 1.5, py: 0, borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Full Name"
                name="name"
                autoFocus
                value={user.name}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                size="medium"
                sx={{ py: 1, borderRadius: 1.5, textTransform: "none", fontWeight: "bold" }}
              >
                Sign Up
              </Button>
            </Box>

            <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
              <Link component={RouterLink} to="/" variant="body2" underline="hover">
                Already have an account? Sign In
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Register;