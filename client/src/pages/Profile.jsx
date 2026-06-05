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
  ListItemText,
  Chip,
} from "@mui/material";
import { Person } from "@mui/icons-material";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container maxWidth="xs">
      {/* Reduced margins from mt:4 to mt:2 */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card elevation={2} sx={{ borderRadius: 1.5, width: "100%", p: 0.5 }}>
          <CardContent sx={{ "&:last-child": { pb: 0.5 }, p: 1 }}>
            {/* Small Header Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Avatar
                sx={{ m: 0.5, bgcolor: "primary.main", width: 36, height: 36 }}
              >
                <Person fontSize="small" />
              </Avatar>
              <Typography
                component="h1"
                variant="h6"
                fontWeight="bold"
                fontSize="1.1rem"
              >
                User Profile
              </Typography>
            </Box>

            <Divider />

            {/* Hyper-Compact Line-by-Line List Layout */}
            <List disablePadding>
              {/* Name Row */}
              <ListItem sx={{ px: 0.5, py: 0.5 }} dense>
                <ListItemText
                  primary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      fontSize="0.7rem"
                    >
                      Name
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontSize="0.85rem"
                    >
                      {user?.name || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />

              {/* Email Row */}
              <ListItem sx={{ px: 0.5, py: 0.5 }} dense>
                <ListItemText
                  primary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      fontSize="0.7rem"
                    >
                      Email
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontSize="0.85rem"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {user?.email || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />

              {/* Phone Row */}
              <ListItem sx={{ px: 0.5, py: 0.5 }} dense>
                <ListItemText
                  primary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      fontSize="0.7rem"
                    >
                      Phone
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontSize="0.85rem"
                    >
                      {user?.phone || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />

              {/* Role Row */}
              <ListItem
                sx={{
                  px: 0.5,
                  py: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                dense
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      fontSize="0.7rem"
                    >
                      Role
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontSize="0.85rem"
                      fontWeight="medium"
                    >
                      {user?.role || "USER"}
                    </Typography>
                  }
                />
                <Chip
                  label={user?.role || "USER"}
                  size="small"
                  color={user?.role === "ADMIN" ? "error" : "default"}
                  variant="outlined"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.65rem",
                    height: "18px",
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Profile;
