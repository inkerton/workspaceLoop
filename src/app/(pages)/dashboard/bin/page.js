"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import BinIncidents from "@/app/components/BinIncidents";
import { Typography, Box, Divider } from "@mui/material";
import { FileWarning, Info, Trash2 } from "lucide-react";

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
      <Typography variant="h4" gutterBottom className="p-2 mt-1 flex">
        <Trash2 size={38} className=" text-gray-500"/>Binned Incidents
      </Typography>
      <Divider  sx={{ opacity: 0.6 }} />

      <div className="p-2">
        <Typography variant="h6" color={"black"} sx={{ fontWeight: "bold" }}>
          Total Incidents:{" "}
          <span style={{ color: "#12a1c0", fontWeight: "bold" }}>{count}</span>
        </Typography>

        <Typography variant='h7' className="flex text-gray-500 text-sm">
            <Info size={20}/> The bin contains information of deleted incidents along with deleted-on and deleted-by fields. 
            The incidents can be edited only after restoring them back.
        </Typography>
        
      </div>

      <BinIncidents data={data} />
    </div>
  );
}

export default BinPage;
