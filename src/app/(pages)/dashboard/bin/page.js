"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BinIncidents from "@/app/components/BinIncidents";
import { Typography, Box, Divider } from "@mui/material";
import { FileWarning } from "lucide-react";

function BinPage() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState("");

  const getBin = async () => {
    try {
      const response = await axios.get("/api/bin");
      setData(response.data.data);
      setCount(response.data.count);
      if (response.status === 200) {
        toast.success("Incident fetched successfully");
      } else {
        toast.error("Failed to update incident");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the incident" + error);
    }
  };

  useEffect(() => {
    getBin();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom className="p-2">
        Binned Incidents
      </Typography>
      <Divider/>

      <div className="p-2">
        <Typography variant="h6" color={"black"} sx={{ fontWeight: "bold" }}>
          Total Incidents:{" "}
          <span style={{ color: "#12a1c0", fontWeight: "bold" }}>{count}</span>
        </Typography>

        <Typography className="flex ">
            <FileWarning/> The bin contains info. of deleted incidents along with deleted on and deleted by fields. 
            The incidents can be restored back ,once added to bin.
        </Typography>
      </div>

      <BinIncidents data={data} />
    </div>
  );
}

export default BinPage;
