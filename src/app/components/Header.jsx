import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";

function Header() {
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Image src={"./logo.svg"} alt="logo" width={160} height={100} />
      {/* {isSignedIn}?
      <userbutton/> : <link href={'/signin}><button>get started</button></link? */}
      <Button
        variant="contained"
        color="primary"
        href="/signin"
        sx={{
          backgroundColor: "#12a1c0",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0F839D",
          },
        }}
      >
        Get Started
      </Button>
    </div>
  );
}

export default Header;
