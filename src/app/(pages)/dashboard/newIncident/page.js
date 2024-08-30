"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { useTheme } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

import entityImpactedOptions from "@/app/components/Options/EntityImpactedOptions";
import allInputSourceOptions from "@/app/components/Options/InputSourceOptions";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const filter = createFilterOptions();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function NewIncident() {
  const theme = useTheme();
  const [incidentNo, setIncidentNo] = useState("");
  const [inputSource, setInputSource] = useState(null);
  const [dateOfInput, setDateOfInput] = useState(null);
  const [entityImpacted, setEntityImpacted] = useState(null);
  const [category, setCategory] = useState("");
  const [brief, setBrief] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("ASSIGNED");
  const [index, setIndex] = useState(0);
  const [inputSourceOptions, setInputSourceOptions] = useState(
    allInputSourceOptions
  );

  const [assignedToOptions, setAssignedToOptions] = useState([]);

  const [entityImpactedOpt, setEntityImpactedOpt] = useState(
    entityImpactedOptions
  );

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/register");
      const data = response.data.data;
      if (response.status == 200) {
        setAssignedToOptions(data);
        toast.success("data fetched successfully");
      } else {
        toast("could not get users");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getIncidentsCount = async () => {
    try {
      const response = await axios.get("/api/count");
      const data = response.data;
      console.log(data);
      if (response.status == 200) {
        setIndex(data.count + 1);
      } else {
        toast.error("could not get document count");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIncidentsCount();
    getUsers();
  }, []);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setIncidentNo(`${date}IPINC${index}`);
  }, [index]);

  const handleNewInputSource = (newName) => {
    if (!inputSourceOptions.includes(newName)) {
      setInputSourceOptions([...inputSourceOptions, newName]);
    }
  };

  const handleNewEntity = (newName) => {
    if (!entityImpactedOpt.includes(newName)) {
      setEntityImpactedOpt([...entityImpactedOpt, newName]);
    }
  };

  const handleNewAssignedTo = (newName) => {
    if (!assignedTo.includes(newName)) {
      setAssignedTo([...assignedTo, newName]);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    console.log(personName);
    // setAssignedTo(personName);
    // console.log('ass  ',assignedTo)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/newincident", {
        incidentNo,
        inputSource,
        dateOfInput,
        entityImpacted,
        category,
        brief,
        assignedTo,
        status,
        comment,
      });
      console.log("12121212121:", response.data);
      setIndex(index + 1);
      if (response.status == 200) {
        setInputSource(null);
        setDateOfInput(null);
        setEntityImpacted(null);
        setCategory("");
        setBrief("");
        setAssignedTo([]);
        setComment("");
        return toast.success("data stored successfully");
      }
      return toast.error("storage failed");
      // Optionally reset the form fields after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, maxWidth: 1000, mx: "auto" }}
      >
        <div className="items-center">
          <Typography
            variant="h4"
            gutterBottom
            color={"#12a1c0"}
            sx={{ alignContent: "center", fontWeight: "bold", mb: 2 }}
          >
            Incident Form
          </Typography>
          <Divider />
        </div>
        <Grid container spacing={2}>
          {/* incident no. */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">
                  {" "}
                  {/* sx={{ whiteSpace: 'nowrap'}} */}
                  Incident No:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Incident No"
                  value={incidentNo}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ flexGrow: 1 }}
                />
              </Grid>
            </Box>
          </Grid>

          {/* assigned to */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Assigned To:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  multiple
                  options={assignedToOptions}
                  value={assignedTo}
                  onInputChange={(event, newValue) => setAssignedTo(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      handleNewAssignedTo(newValue);
                      setAssignedTo([...assignedTo, newValue]);
                    } else if (newValue && newValue.inputValue) {
                      handleNewAssignedTo(newValue.inputValue);
                      setAssignedTo([...assignedTo, newValue.inputValue]);
                    } else {
                      setAssignedTo(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.title || option}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assigned To"
                      margin="normal"
                      fullWidth
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>

          {/* input source */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Input Source:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={inputSourceOptions}
                  value={inputSource}
                  onInputChange={(event, newValue) => setInputSource(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      handleNewInputSource(newValue);
                      setInputSource(newValue);
                    } else if (newValue && newValue.inputValue) {
                      handleNewInputSource(newValue.inputValue);
                      setInputSource(newValue.inputValue);
                    } else {
                      setInputSource(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.title || option}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Input Source"
                      margin="normal"
                      fullWidth
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>

          {/* date of input */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Date of Input:</Typography>
              </Grid>

              <Grid item xs={9}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateOfInput ? dayjs(dateOfInput) : null} // Ensure the date is handled correctly
                    onChange={(newValue) => {
                      // Ensure newValue is valid before formatting
                      if (newValue) {
                        const formattedDate =
                          dayjs(newValue).format("YYYY-MM-DD");
                        setDateOfInput(formattedDate);
                      } else {
                        setDateOfInput(null); // Handle the case where newValue is null
                      }
                    }}
                    format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
              </Grid>
            </Box>
          </Grid>

          {/* Entity Impacted */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Entity Impacted:</Typography>
              </Grid>

              <Grid item xs={9}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={entityImpactedOpt}
                  value={entityImpacted}
                  onInputChange={(event, newValue) =>
                    setEntityImpacted(newValue)
                  }
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      handleNewEntity(newValue);
                      setEntityImpacted(newValue);
                    } else if (newValue && newValue.inputValue) {
                      handleNewEntity(newValue.inputValue);
                      setEntityImpacted(newValue.inputValue);
                    } else {
                      setEntityImpacted(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.title || option}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Entity Impacted"
                      margin="normal"
                      fullWidth
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
              </Grid>
            </Box>
          </Grid>

          {/* category */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Category:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  margin="normal"
                  fullWidth
                  sx={{ flexGrow: 1 }}
                >
                  <MenuItem value="CII">CII</MenuItem>
                  <MenuItem value="Non-CII">Non-CII</MenuItem>
                </TextField>
              </Grid>
            </Box>
          </Grid>

          {/* brief */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Brief:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextareaAutosize
                  placeholder="Brief"
                  minRows={2}
                  maxRows={2000}
                  style={{
                    width: "100%",
                    border: "1px solid black",
                    borderRadius: "4px",
                    padding: "8px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#12a1c0")}
                  onBlur={(e) => (e.target.style.borderColor = "black")}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </Grid>
            </Box>
          </Grid>

          {/* comments */}
          <Grid item xs={12}>
            <Box
              className="flex"
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">Initial Comments:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextareaAutosize
                  placeholder="Comment"
                  minRows={2}
                  maxRows={2000}
                  style={{
                    width: "100%",
                    border: "1px solid black",
                    borderRadius: "4px",
                    padding: "8px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#12a1c0")}
                  onBlur={(e) => (e.target.style.borderColor = "black")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 14,
              backgroundColor: "#12a1c0",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0F839D",
              },
            }}
          >
            Submit New Incident
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default NewIncident;
