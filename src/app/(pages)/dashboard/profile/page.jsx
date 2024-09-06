"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { ChangeCircle, ChangeCircleOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function ContentPage() {
  const [value, setValue] = useState(0);
  const [username, setUsername] = useState("N");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  console.log(newPassword)

  const handleGetCookie = () => {
    const cookie = Cookies.get("username");
    setUsername(cookie);
    const cookieEmail = Cookies.get("email");
    setEmail(cookieEmail);
  };

  const getLogs = async () => {
    try {
      const response = await axios.get("/api/changelogs");
      setData(response.data);
      if (response.status === 200) {
        console.log("logs fetched successfully");
      } else {
        toast.error("Failed to update incident");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the logs" + error);
    }
  };

  useEffect(() => {
    handleGetCookie();
    getLogs();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("email");
    Cookies.remove("role");
  };
  
  const handlePasswordChange = (event) => setNewPassword(event.target.value);

  const handleClickHere = async () => {
    setShowPasswordField(!showPasswordField);
    if (!showPasswordField) {
      try {
        const response = await axios.get("/api/profile",{
          params: {
            username: username, // Send the username as a query parameter
          },
        });
        const asciiArray = response.data.password.data;
        const passwordString = String.fromCharCode(...asciiArray);
        setNewPassword(passwordString);

        // Assuming the response contains the password
      } catch (error) {
        console.error("Error fetching password:", error);
      }
    }
  };

  // Handle password change request
  const handleChangePassword = async () => {
    try {
      const response = await axios.post("/api/profile", {
        username,
        newPassword,
      });
      console.log("Password changed successfully:", response.data);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Username",
        size: 200,
      },
      {
        accessorKey: "incidentNo",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Incident",
        size: 200,
      },
      {
        accessorKey: "action",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "action",
        size: 500,
      },
      {
        accessorFn: (row) => {
          const date = new Date(row.timeOfAction);
          const istOffset = 5 * 60 + 30; // IST is UTC+5:30
          const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
          return istTime;
        },
        id: "timeOfAction",
        header: "Time of Action (IST)",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        size: 250,
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          return dateValue
            ? dateValue.toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "Unknown";
        },
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: false,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: false,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      shape: "rounded",
      variant: "outlined",
    },

    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd)": {
          backgroundColor: "#f5f5f5",
        },
      },
    },

    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#eee",
        },
      },
    }),
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor:
          column.id === "mrt-row-actions" ? "#12a1c0" : "#12a1c0",
        color: column.id === "mrt-row-actions" ? "black" : "white",
        fontWeight: "bold",
        border: "1px solid #ddd",
        padding: "8px",
      },
    }),
    muiTableProps: {
      sx: {
        borderCollapse: "collapse",
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: 4,
        boxShadow: "0px 2px 10px #ddd",
        "& .MuiTableCell-body": {
          border: "1px solid #ddd",
        },
        "& .MuiTableRow-root:hover": {
          backgroundColor: "#eee",
        },
        "& .MuiTableRow-root:nth-of-type(odd)": {
          backgroundColor: "#f9f9f9 !important",
        },
      },
    },
  });

  return (
    <div className="">
      <Card sx={{ width: "100%" }}>
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Change Logs" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            {/* Profile Content */}
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
                            fullWidth
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
                            id="outlined-email"
                            defaultValue="example@example.com"
                            value={email}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                        </Grid>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h7" className="p-2">
                        Want to change password?{" "}
                        <span
                          style={{
                            color: "#12a1c0",
                            fontStyle: "italic",
                            cursor: "pointer",
                          }}
                          onClick={handleClickHere}
                        >
                          Click Here
                        </span>
                      </Typography>
                    </Grid>
                    {showPasswordField && (
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
                            <Typography variant="h6">New Password:</Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              id="outlined-password"
                              type="text"
                              value={newPassword}
                              onChange={handlePasswordChange}
                              fullWidth
                            />
                          </Grid>
                        </Box>
                      </Grid>
                    )}
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
                        "&:hover": {
                          backgroundColor: "#0F839D",
                        },
                      }}
                      startIcon={<ChangeCircleOutlined />}
                      onClick={handleChangePassword}
                    >
                      Change password
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: "#12a1c0",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#0F839D",
                    },
                  }}
                  startIcon={<LogOut />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography
              variant="h4"
              color={"black"}
              sx={{ fontWeight: "bold" }}
            >
              Change Logs
            </Typography>
            <Divider />
            <p className="mt-1">Changes logs of all users and all history</p>
            <div>
              <Card sx={{ mt: 2, mb: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MaterialReactTable table={table} />
                </LocalizationProvider>
              </Card>
            </div>
          </TabPanel>
        </Box>
      </Card>
    </div>
  );
}
