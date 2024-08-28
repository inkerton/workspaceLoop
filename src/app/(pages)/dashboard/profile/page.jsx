"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LogOut } from "lucide-react";

function page() {
  const [cookieValue, setCookieValue] = useState("");
  const [username, setUsername] = useState("N");
  const [email, setEmail] = useState("");

  const handleGetCookie = () => {
    const cookie = Cookies.get("username");
    setCookieValue(cookie || "No cookie found");
    setUsername(cookie);
    const cookieEmail = Cookies.get("email");
    setEmail(cookieEmail);
  };

  useEffect(() => {
    handleGetCookie();
  }, []);

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("email");
    setCookieValue("");
    setAnchorEl(null);
  };

  return (
    <div>
      <div className="p-8">
        <Card sx={{ maxHeight: 1000 }}>
          <CardContent>
            <Typography
              variant="h4"
              color={"black"}
              sx={{ fontWeight: "bold" }}
            >
              Profile
            </Typography>
            <Divider />
            <div className="w-full">
              <Card sx={{ boxShadow: "sm" }} className="shadow-md">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        className="flex"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Grid item xs={3}>
                          <Typography variant="h6">Username:</Typography>
                        </Grid>

                        <Grid item xs={9}>
                          <TextField
                            id="outlined-username"
                            defaultValue="NCIIPC"
                            value={username}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        className="flex"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Grid item xs={3}>
                          <Typography variant="h6">Email:</Typography>
                        </Grid>

                        <Grid item xs={9}>
                          <TextField
                            id="outlined-username"
                            defaultValue="NCIIPC"
                            value={email}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <div className="flex justify-end mr-4">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 2,
                        mb: 2,
                        backgroundColor: "#12a1c0",
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: '#0F839D',
                            }, 
                      }}
                      startIcon={<LogOut />}
                      onClick={handleLogout} 
                    >
                      Logout  
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
