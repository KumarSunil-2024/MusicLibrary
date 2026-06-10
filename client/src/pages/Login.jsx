import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import { Container, Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Avatar } from "@mui/material";
import { LibraryMusic } from "@mui/icons-material";
import api from "../services/api";

// SIMPLE YUP SCHEMA CONFIGURATION
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be 6 or more characters"),
});

function Login() {
  // NAVIGATION ROUTING HOOK INSTANCE
  const navigate = useNavigate();

  // LOCAL REACT STATE HOOKS
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // TRACK INPUT FIELD CHANGES
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // CLEAR FIELD ERROR LOCALLY
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // HANDLED SECURE FORM TERMINAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    try {
      // RUN PLAIN YUP VALIDATION
      await loginSchema.validate(formData, { abortEarly: false });

      // EXECUTE AUTHENTICATION API CALL
      const res = await api.post("/auth/login", formData);

      // SAVE TOKEN STORAGE RECORDS
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // REDIRECT DEPENDING USER ROLE
      navigate(res.data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      // CATCH YUP VALIDATION ERRORS
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        // CATCH BACKEND DATABASE REJECTIONS
        setServerError(err.response?.data?.message || "Login Failed");
      }
    }
  };

  return (
    // MAIN APP VIEW CENTERER
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card elevation={2} sx={{ borderRadius: 2, width: "100%", p: 1 }}>
          <CardContent sx={{ "&:last-child": { pb: 1 } }}>
            
            {/* MINI APP LOGO AVATAR */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1.5 }}>
              <Avatar sx={{ m: 0.5, bgcolor: "primary.main", width: 40, height: 40 }}>
                <LibraryMusic fontSize="small" />
              </Avatar>
              <Typography component="h1" variant="h6" fontWeight="bold">
                Music Library
              </Typography>
            </Box>

            {/* SERVER API ERROR DISPLAYER */}
            {serverError && (
              <Alert severity="error" sx={{ mb: 1.5, py: 0, borderRadius: 1.5 }}>
                {serverError}
              </Alert>
            )}

            {/* FORM COMPONENT CONTENT CONTAINER */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* EMAIL COMPONENT TEXT FIELD */}
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
                error={!!errors.email}
                helperText={errors.email}
              />
              {/* PASSWORD COMPONENT TEXT FIELD */}
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
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 2 }}
              />

              {/* ACTION EXECUTION BUTTON ACTION */}
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

            {/* ROUTER REGISTRATION FORWARD LINK */}
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