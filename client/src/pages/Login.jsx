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
import { LibraryMusic } from "@mui/icons-material";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card elevation={2} sx={{ borderRadius: 2, width: "100%", p: 1 }}>
          <CardContent sx={{ '&:last-child': { pb: 1 } }}>
            {/* Minimal Header */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1.5 }}>
              <Avatar sx={{ m: 0.5, bgcolor: "primary.main", width: 40, height: 40 }}>
                <LibraryMusic fontSize="small" />
              </Avatar>
              <Typography component="h1" variant="h6" fontWeight="bold">
                Music Library
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
                label="Email Address"
                name="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                sx={{ py: 1, borderRadius: 1.5, textTransform: "none", fontWeight: "bold" }}
              >
                Sign In
              </Button>
            </Box>

            <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
              <Link component={RouterLink} to="/register" variant="body2" underline="hover">
                Create an account
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;