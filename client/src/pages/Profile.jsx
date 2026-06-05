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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const storedUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [name, setName] =
    useState(
      storedUser?.name || ""
    );

  const [phone, setPhone] =
    useState(
      storedUser?.phone || ""
    );

  const updateProfile =
    async () => {
      try {
        const res =
          await api.put(
            "/auth/profile",
            {
              name,
              phone,
            }
          );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data
          )
        );

        alert(
          "Profile Updated"
        );
      } catch (error) {
        console.log(error);
      }
    };

  const deleteUser =
    async () => {
      const confirmDelete =
        window.confirm(
          "Delete Account?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        await api.delete(
          "/auth/profile"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );

        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <Container maxWidth="sm">

      <Box sx={{ mt: 3 }}>

        <Card>

          <CardContent>

            <Box
              sx={{
                textAlign:
                  "center",
                mb: 2,
              }}
            >

              <Avatar
                sx={{
                  bgcolor:
                    "primary.main",
                  mx: "auto",
                }}
              >
                <Person />
              </Avatar>

              <Typography
                variant="h5"
                mt={1}
              >
                User Profile
              </Typography>

            </Box>

            <Divider />

            <List>

              <ListItem>

                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(
                    e
                  ) =>
                    setName(
                      e.target
                        .value
                    )
                  }
                />

              </ListItem>

              <ListItem>

                <TextField
                  fullWidth
                  label="Email"
                  value={
                    storedUser?.email
                  }
                  disabled
                />

              </ListItem>

              <ListItem>

                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(
                    e
                  ) =>
                    setPhone(
                      e.target
                        .value
                    )
                  }
                />

              </ListItem>

              <ListItem>

                <Chip
                  label={
                    storedUser?.role
                  }
                  color="primary"
                />

              </ListItem>

            </List>

            <Box
              sx={{
                display:
                  "flex",
                gap: 2,
                mt: 2,
              }}
            >

              <Button
                variant="contained"
                fullWidth
                onClick={
                  updateProfile
                }
              >
                Update Profile
              </Button>

              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={
                  deleteUser
                }
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