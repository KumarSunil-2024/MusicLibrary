import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        mt: 4,
        py: 2,
        textAlign: "center",
        bgcolor: "primary.main",
        color: "white",
      }}
    >
      <Typography variant="body2">© 2026 Music Library Application</Typography>
    </Box>
  );
}

export default Footer;
