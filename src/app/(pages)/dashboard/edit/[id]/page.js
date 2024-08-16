'use client'
import React, { useState, useEffect } from 'react'
import chipOptions from '@/app/components/Options/chipOptions';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Grid,
    TextField,
    MenuItem,
    FormControl,
    FormControlLabel,
    Radio,
    ListSubheader,
    RadioGroup,
    Tooltip,
    Chip,
    List,
    ListItem,
  } from "@mui/material";
import axios from 'axios';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import entityImpactedOptions from '@/app/components/Options/EntityImpactedOptions';
import allInputSourceOptions from '@/app/components/Options/InputSourceOptions';
import dayjs from 'dayjs';



  const filter = createFilterOptions();

function page({ params }) {

    const currentID = params.id;
    console.log(currentID);
    const [incidentData, setIncidentData] = useState([]);
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [status, setStatus] = useState("ASSIGNED");
    const [incidentNo, setIncidentNo] = useState(currentID);
    const [comment, setComment] = useState('');
    const [dateOfInput, setDateOfInput] = useState(null);
    const [entityImpacted, setEntityImpacted] = useState(null);
    const [category, setCategory] = useState('');
    const [inputSource, setInputSource] = useState(null);
    const [brief, setBrief] = useState('');
    const [inputSourceOptions, setInputSourceOptions] = useState(allInputSourceOptions);

    const [ entityImpactedOpt, setEntityImpactedOpt ] = useState(entityImpactedOptions);






    const getUsers = async () => {
        try {
          const response = await axios.get("/api/auth");
          const data = response.data.data;
          console.log(data);
          if (response.status == 200) {
            const userOptions = data.map((user) => user.username);
            console.log(userOptions);
            setAssignedToOptions(userOptions);
            alert("data fetched successfully");
          } else {
            alert("could not get document count");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const getIncidentInfo = async (incidentNo) => {
        try {
          const response = await axios.get(
            `/api/incidents/?incidentNo=${encodeURIComponent(incidentNo)}`
          );
          const data = response.data.data;
          console.log("incidents data", data);
    
          setIncidentData(data);
          setAssignedTo(data.assignedTo);
          setIncidentNo(data.incidentNo);
          setComment(data.comment);
          setInputSource(data.inputSource);
          // const formattedDate = new Date(data.dateOfInput).toLocaleString();
          console.log('date:',data.dateOfInput)
          const formattedDate = dayjs(data.dateOfInput).startOf('day');
          console.log('date:',formattedDate)
          setDateOfInput(formattedDate.isValid() ? formattedDate : null);
          setEntityImpacted(data.entityImpacted);
          setCategory(data.category);
          setBrief(data.brief);
    
          if (response.status == 200) {
            // return alert('fetched successfully');
            console.log("success");
          } else {
            console.log("something went wrong");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        if (currentID) {
          getIncidentInfo(currentID);
          getUsers();
        }
      }, [currentID]);



      const handleNewInputSource = (newName) => {
        if (!inputSourceOptions.includes(newName)) {
          setInputSourceOptions([...inputSourceOptions, newName]);
        }
      };

      const handleNewEntity = ( newName ) => {
        if(!entityImpactedOpt.includes(newName)) {
          setEntityImpactedOpt([...entityImpactedOpt, newName]);
        }
      };


      const handleSelectionChange = (event, value) => {
        setAssignedTo(value);
      };
    
      const handleUpdate = async () => {
        console.log(comment);
        try {
          const response = await axios.put("/api/editincident", {
            incidentNo,
            assignedTo,
            comment,
            inputSource,
            dateOfInput,
            entityImpacted,
            category,
            brief,
          });
          if (response.status === 200) {
            alert("Incident updated successfully");
          } else {
            alert("Failed to update incident");
          }
        } catch (error) {
          console.log(error);
          alert("An error occurred while updating the incident");
        }
      };

  return (
    <div>
      <div>
      <Card
              sx={{
                backgroundColor: "#E6F9FD",
                mt: 2,
                mb: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                variant="h4"
                color={"#12a1c0"}
                sx={{ fontWeight: "bold", mb: 2 }}
                >
                {currentID}
                </Typography>
                <Divider />
                <Grid container spacing={2}>
                  {/* status */}
                  <Grid item xs={12}>
                    <Box
                      className="flex"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        ml: 6,
                        mr: 6,
                      }}
                    >
                      <Grid item xs={3}>
                        <Typography variant="h6">Status:</Typography>
                      </Grid>

                      <Grid item xs={9}>
                        <TextField
                          select
                          label="status"
                          defaultValue="Assigned"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          margin="normal"
                          fullWidth
                          sx={{ flexGrow: 1, backgroundColor: "white" }}
                        >
                          <MenuItem value="ASSIGNED">Assigned</MenuItem>
                          <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
                          <MenuItem value="INFORMATION_AWAITED">
                            Information Awaited
                          </MenuItem>
                          <MenuItem value="PROCESSING">Processing</MenuItem>
                          <MenuItem value="TEAM_SENT">Team Sent</MenuItem>
                          <MenuItem value="REPORT_BEING_PREPARED">
                            Report Being Prepared
                          </MenuItem>
                        </TextField>
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
                        ml: 6,
                        mr: 6,
                      }}
                    >
                      <Grid item xs={3}>
                        <Typography variant="h6">Assigned To:</Typography>
                      </Grid>

                      <Grid item xs={9}>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={assignedToOptions}
                          getOptionLabel={(option) => option}
                          value={assignedTo}
                          onChange={handleSelectionChange}
                          sx={{ flexGrow: 1, backgroundColor: "white" }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Assigned To"
                              placeholder="Select users"
                              fullWidth
                              sx={{ flexGrow: 1, backgroundColor: "white" }}
                            />
                          )}
                        />
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 4, backgroundColor: "#12a1c0", color: "#fff" }}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
      </div>

      <div>
      <Box component="form" onSubmit={handleUpdate} sx={{ p: 2, maxWidth: 1000, mx: 'auto' }} >
        <Grid container spacing={2}>
        
        {/* assigned to */}
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
                        <Typography variant="h6">Assigned To:</Typography>
                      </Grid>

                      <Grid item xs={9}>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={assignedToOptions}
                          getOptionLabel={(option) => option}
                          value={assignedTo}
                          onChange={handleSelectionChange}
                          sx={{ flexGrow: 1, backgroundColor: "white" }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Assigned To"
                              placeholder="Select users"
                              fullWidth
                              sx={{ flexGrow: 1, backgroundColor: "white" }}
                            />
                          )}
                        />
                      </Grid>
                    </Box>
                  </Grid>

                  {/* input source */}
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
              <Typography variant="h6" >
                  Input Source:
                </Typography>
                </Grid>
                <Grid item xs={9}>
                  
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={inputSourceOptions}
                  value={inputSource}
                  onInputChange={(event, newValue) => setInputSource(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
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
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
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
                    if (typeof option === 'string') {
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

                  {/* comments */}
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Initial Comments:
                </Typography>
                </Grid>
                <Grid item xs={9}>
                <TextareaAutosize
                            placeholder="Artifacts/IOC Details"
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
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#12a1c0")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "black")
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />


                  </Grid>
              </Box>
            </Grid>

            {/* date of input */}
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Grid item xs={3}>
              <Typography variant="h6" >
                  Date of Input:
                </Typography>
                </Grid>

                <Grid item xs={9}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                    value={dateOfInput}
                    onChange={(newValue) => setDateOfInput(newValue)}
                    format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </Grid>
              </Box>
            </Grid>

                  {/* Entity Impacted */}
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Entity Impacted:
                </Typography>
                </Grid>

                <Grid item xs={9}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={entityImpactedOpt}
                  value={entityImpacted}
                  onInputChange={(event, newValue) => setEntityImpacted(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
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
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
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
                    if (typeof option === 'string') {
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
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Category:
                </Typography>
                </Grid>
                <Grid item xs={9}>

                <TextField
                  select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  margin="normal"
                  fullWidth
                  sx={{ flexGrow: 1}}
                >
                  <MenuItem value="C1">C1</MenuItem>
                  <MenuItem value="C2">C2</MenuItem>
                </TextField>
                </Grid>

              </Box>
            </Grid>

            {/* brief */}
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Brief:
                </Typography>
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
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#12a1c0")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "black")
                    }
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    />
                </Grid>

              </Box>
            </Grid>

          </Grid>
          
          <div className='flex justify-end'>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 14, backgroundColor: '#12a1c0', color: '#fff' }}>
              Submit New Incident
            </Button>
          </div>

      </Box>
    </div>
    </div>
  )
}

export default page
