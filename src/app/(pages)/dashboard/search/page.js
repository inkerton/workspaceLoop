"use client";
import SearchedIncidents from "@/app/components/SearchedIncidents";
import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

function SearchPage() {
  const [searchValue, setSearchValue] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchvalue:", searchValue);

  const handleSearch = async () => {
    console.log("object inside search", searchValue);
    if (searchValue === "") {
      alert("Search value cannot be empty!!!");
    } else {
      await searchIncidents();
    }
  };

  const searchIncidents = async () => {
    try {
      const response = await axios.post("/api/search", { searchValue });
      const data = await response.data;
      setSearchResults(data);

      if (response.status == 200) {
        console.log("Search results fetched successfully", data);
        toast("Search results fetched successfully")
      } else {
        toast("Search failed: ");
      }
    } catch (error) {
      console.error("Error searching value:", error);
      toast("An error occurred while searching");
    }
  };

  return (
    <div>
      <Box className="p-6 mr-4">
        <div className="w-full">
          <TextField
            id="outlined-search"
            label="Search field"
            type="search"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full"
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "#12a1c0",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0F839D",
            },
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <div>
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <p key={item._id}>
              {item.incidentNo}
            </p>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>

      <div>
        <SearchedIncidents data={searchResults}/>
      </div>
    </div>
  );
}

export default SearchPage;
