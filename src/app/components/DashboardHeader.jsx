"use client";
import { CircleUserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button, Typography } from "@mui/material";
import Cookies from "js-cookie";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

function DashboardHeader() {
  const [cookieValue, setCookieValue] = useState("");
  const [username, setUsername] = useState("N");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetCookie = () => {
    const cookie = Cookies.get("username");
    setCookieValue(cookie || "No cookie found");
    setUsername(cookie);
  };
  // console.log("user is on the board: ", cookieValue);

  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("email");
    setCookieValue("");
    setAnchorEl(null);
  };

  useEffect(() => {
    handleGetCookie();
  }, []);

  return (
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div>
        <Typography variant="h6" color={"black"} sx={{ fontWeight: "bold", mt: 1}}> 
          {/* color: '#12a1c0'  */}
        Workspace-Loop
        </Typography>
      </div>
      {/* <div>
      <button onClick={handleGetCookie}>Get Cookie</button>
        <CircleUserRound />
        <Button onClick={handleLogout}>LogOut</Button>
      </div> */}
      <div>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "#12a1c0" }}>
              {username.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default DashboardHeader;
