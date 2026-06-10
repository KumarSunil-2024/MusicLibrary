import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Avatar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import * as yup from "yup";
import api from "../services/api";

// REGISTRATION DATA VALIDATION RULES
const registerSchema = yup.object({
  name: yup.string().required("Name is required"),

  emailId: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Register() {
  // NAVIGATION ROUTING HOOK INSTANCE
  const navigate = useNavigate();

  // LOCAL STATE USER DATA
  const [user, setUser] = useState({
    name: "",
    emailId: "",
    phone: "",
    password: "",
  });

  // ALERT ERROR HANDLING STATES
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // INPUT FIELD CONTROLLER STATE
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // FORM SUBMISSION EVENT SYSTEM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});

    try {
      // EXECUTE VALIDATION ATTRIBUTE LOOKUP
      await registerSchema.validate(user, { abortEarly: false });

      // FIRE ENDPOINT POST RECORD
      await api.post("/auth/register", user);

      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      // PARSE CLIENT-SIDE SCHEMA ERRORS
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // PARSE SERVER SYSTEM REJECTIONS
        setError(error.response?.data?.message || "Registration Failed");
      }
    }
  };

  return (
    // MAIN REGISTRATION VIEW CENTERER
    <Container maxWidth="xs">
      <Box sx={{ mt: 3, mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Card elevation={2} sx={{ borderRadius: 2, width: "100%", p: 1 }}>
          <CardContent sx={{ "&:last-child": { pb: 1 } }}>
            
            {/* COMPONENT TITLE AVATAR BRAND */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1.5 }}>
              <Avatar sx={{ m: 0.5, bgcolor: "success.main", width: 40, height: 40 }}>
                <PersonAdd fontSize="small" />
              </Avatar>
              <Typography component="h1" variant="h6" fontWeight="bold">
                Create Account
              </Typography>
            </Box>

            {/* SERVER ACCOUNT ERROR COMPONENT */}
            {error && (
              <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}

            {/* SECURE SUBMISSION POST TERMINAL */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* FULL NAME INTERACTIVE ROW */}
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
                error={!!errors.name}
                helperText={errors.name}
              />

              {/* EMAIL ID INTERACTIVE ROW */}
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Email Address"
                name="emailId"
                type="email"
                value={user.emailId}
                onChange={handleChange}
                error={!!errors.emailId}
                helperText={errors.emailId}
              />

              {/* PHONE NUMBER INTERACTIVE ROW */}
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />

              {/* SECURITY PASSWORD INTERACTIVE ROW */}
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
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 2 }}
              />

              {/* EXECUTE REGISTER STATE COMMAND */}
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

            {/* REVERSE GATE ROUTE LINK */}
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