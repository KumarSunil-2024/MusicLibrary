import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LibraryMusic } from "@mui/icons-material";

function Navbar() {
  const navigate = useNavigate();

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

        <Box>
          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;