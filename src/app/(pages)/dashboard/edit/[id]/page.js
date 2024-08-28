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
import { toast } from 'react-toastify';
import { Editor } from '@toast-ui/react-editor';




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

    const [incidentInfo, setIncidentInfo] = useState(null);
    const [entryPointOfContactName, setEntryPointOfContactName] = useState("");
    const [entryPointOfContactNumber, setEntryPointOfContactNumber] = useState("");
    const [logCollectionDetails, setLogCollectionDetails] = useState("");
    const [artifacts, setArtifacts] = useState("");
    const [miscellaneousInfo, setMiscellaneousInfo] = useState("");
    const [TTPDetails, setTTPDetails] = useState([]);

    const [selectedLogOption, setSelectedLogOption] = useState("");
    const handleLogOptionChange = (event) => {
        setSelectedLogOption(event.target.value);
      };
    const editorRef = React.createRef(null);



    const getUsers = async () => {
        try {
          const response = await axios.get("/api/register");
          const data = response.data.data;
          if (response.status == 200) {
            setAssignedToOptions(data);
            toast.success("data fetched successfully");
          } else {
            toast.error("could not get document count");
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
          const formattedDate = dayjs(data.dateOfInput).startOf('day');
          setDateOfInput(formattedDate.isValid() ? formattedDate : null);
          setEntityImpacted(data.entityImpacted);
          setCategory(data.category);
          setBrief(data.brief);

          if (response.data.additionalInfo) {
            const additionalInfo = response.data.additionalInfo;
            console.log('additionalInfo', additionalInfo);
            setIncidentInfo(response.data.additionalInfo || null);
            setEntryPointOfContactName(additionalInfo.entryPointOfContactName);
            setEntryPointOfContactNumber(additionalInfo.entryPointOfContactNumber);
            setLogCollectionDetails(additionalInfo.logCollectionDetails);
            setMiscellaneousInfo(additionalInfo.miscellaneousInfo);
            setArtifacts(additionalInfo.artifacts);
            setTTPDetails(additionalInfo.TTPDetails);
        }
    
          if (response.status == 200) {
            return toast.success('fetched successfully');
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

      const options = chipOptions.flatMap((group) =>
        group.options.map((option) => ({
          ...option,
          group: group.group,
        }))
      );

      const handleTTPDetailsChange = (event, value) => {
        // Flatten chipOptions and find matching options
        const allOptions = chipOptions.flatMap((group) => group.options);
        const selectedTTPs = value.map(
          (val) =>
            allOptions.find((option) => option.value === val) || {
              value: val,
              info: "No info available",
            }
        );
        setTTPDetails(selectedTTPs);
      };


      const handleSelectionChange = (event, value) => {
        setAssignedTo(value);
      };
    
      const handleUpdate = async (e) => {
        e.preventDefault();
        console.log(comment);
        // console.log('entity name', entryPointOfContactName)
        // console.log('entity name', miscellaneousInfo)
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
            entryPointOfContactName,
            entryPointOfContactNumber,
            miscellaneousInfo,
            artifacts,
            TTPDetails,
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            toast.success("Incident updated successfully");
          } else {
            toast.error("Failed to update incident");
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occurred while updating the incident");
        }
      };

  return (
    <div>

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

            {incidentInfo !== null && (
                                <>

                                     {/* Grid item for TTP Details  */}
                                     {incidentInfo.TTPDetails && incidentInfo.TTPDetails.length > 0 ? (
                                        <Grid item xs={12}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            mb: 2,
                                          }}
                                        >
                                          <Grid item xs={3}>
                                            <Typography variant="h6">TTP Details:</Typography>
                                          </Grid>
                                          <Grid item xs={9}>
                                            <Autocomplete
                                              multiple
                                              id="tags-filled"
                                              options={options.map((option) => option.value)} // Use only the value for the options prop
                                              value={TTPDetails.map((item) => item.value)} // Ensure value is an array of simple values
                                              defaultValue={[]}
                                              freeSolo
                                              onChange={handleTTPDetailsChange}
                                              renderTags={(value, getTagProps) =>
                                                value.map((option, index) => {
                                                  const chipOption = options.find(
                                                    (o) => o.value === option
                                                  );
                                                  return (
                                                    <Tooltip
                                                      title={chipOption ? chipOption.info : ""}
                                                      key={index}
                                                    >
                                                      <Chip
                                                        variant="outlined"
                                                        label={option}
                                                        {...getTagProps({ index })}
                                                      />
                                                    </Tooltip>
                                                  );
                                                })
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="TTP Details"
                                                  placeholder="Add a receiver by pressing enter after its dotName or address"
                                                />
                                              )}
                                              renderOption={(props, option) => {
                                                const optionData = options.find(
                                                  (o) => o.value === option
                                                );
                                                const previousGroup =
                                                  options[
                                                    options.findIndex((o) => o.value === option) -
                                                      1
                                                  ]?.group;
                                                const currentGroup = optionData?.group;
                  
                                                return (
                                                  <div {...props} key={option}>
                                                    {currentGroup !== previousGroup && (
                                                      <ListSubheader>
                                                        {currentGroup}
                                                      </ListSubheader>
                                                    )}
                                                    <MenuItem
                                                      value={option}
                                                      data-info={optionData?.info}
                                                    >
                                                      {option}
                                                    </MenuItem>
                                                  </div>
                                                );
                                              }}
                                            />
                                          </Grid>
                                        </Box>
                                      </Grid>
                                    ) : null}

                                    {/* Grid item for Artifacts  */}
                                    {incidentInfo.artifacts && (
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
                                            <Typography variant="h6">
                                              Artifacts/IOC Collection Details:
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
                                              value={artifacts}
                                              onChange={(e) => setArtifacts(e.target.value)}
                                            />
                                          </Grid>
                                        </Box>
                                      </Grid>
                                    )}

                                    {/* Grid item for Miscellaneous Info */}
                                    {incidentInfo.miscellaneousInfo && (
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
                                            <Typography variant="h6">
                                              Miscellaneous Info.:
                                            </Typography>
                                          </Grid>
                  
                                          <Grid item xs={9}>
                                            <TextareaAutosize
                                              placeholder="Any Miscellaneous Info."
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
                                              value={miscellaneousInfo}
                                              onChange={(e) =>
                                                setMiscellaneousInfo(e.target.value)
                                              }
                                            />
                                          </Grid>
                                        </Box>
                                      </Grid>
                                    )}

                                    {/* Grid item for entryPointOfContact  */}
                                    {incidentInfo.entryPointOfContactName && (
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
                                          <Typography variant="h6">
                                            Entity Point of Contact:
                                          </Typography>
                                        </Grid>
                
                                        <Grid item xs={4}>
                                          <TextareaAutosize
                                            placeholder="Name"
                                            minRows={1}
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
                                            value={entryPointOfContactName}
                                            onChange={(e) =>
                                              setEntryPointOfContactName(e.target.value)
                                            }
                                          />
                                        </Grid>
                
                                        <Grid item xs={4}>
                                          <TextareaAutosize
                                            placeholder="Number"
                                            minRows={1}
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
                                            value={entryPointOfContactNumber}
                                            onChange={(e) =>
                                              setEntryPointOfContactNumber(e.target.value)
                                            }
                                          />
                                        </Grid>
                                      </Box>
                                    </Grid>
                                    )}

                                   {/* Grid for Log Collection Details */}
                                   {incidentInfo.logCollectionDetails && (
                                  //   <Grid item xs={12}>
                                  //   <Box
                                  //     className="flex"
                                  //     sx={{
                                  //       display: "flex",
                                  //       alignItems: "center",
                                  //       gap: 2,
                                  //       mb: 2,
                                  //     }}
                                  //   >
                                  //     <Grid item xs={3}>
                                  //       <Typography variant="h6">
                                  //         Log Collection Details:
                                  //       </Typography>
                                  //     </Grid>
              
                                  //     <Grid item xs={9}>
                                  //       <FormControl component="fieldset">
                                  //         <RadioGroup
                                  //           row
                                  //           value={selectedLogOption}
                                  //           onChange={handleLogOptionChange}
                                  //         >
                                  //           <FormControlLabel
                                  //             value="editor"
                                  //             control={<Radio />}
                                  //             label="Editor"
                                  //           />
                                  //         </RadioGroup>
                                  //       </FormControl>
              
                                  //       {selectedLogOption === "editor" && (
                                  //         <Editor
                                  //         initialValue='janvi'
                                  //           previewStyle="vertical"
                                  //           height="600px"
                                  //           initialEditType="wysiwyg"
                                  //           useCommandShortcut={true}
                                  //           ref={editorRef}
                                  //           // initialValue={incidentInfo.logCollectionDetails}
                                  //           // onChange={() => {
                                  //           //     if (editorRef.current) {
                                  //           //         const editorInstance = editorRef.current.getInstance();
                                  //           //         setLogCollectionDetails(editorInstance.getMarkdown());
                                  //           //     }
                                  //           // }}
                                              
                                  //         />
                                  //       )}
                                  //     </Grid>
                                  //   </Box>
                                  // </Grid>

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
                                      <Typography variant="h6">
                                        Log Collection Details:
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={9}>
                                      <FormControl component="fieldset">
                                        <RadioGroup
                                          row
                                          value={selectedLogOption}
                                          onChange={handleLogOptionChange}
                                        >
                                          <FormControlLabel
                                            value="plainText"
                                            control={<Radio />}
                                            label="Plain Text"
                                          />
                                          <FormControlLabel
                                            value="editor"
                                            control={<Radio />}
                                            label="Editor"
                                          />
                                        </RadioGroup>
                                      </FormControl>

                                      {selectedLogOption === "plainText" && (
                                        <TextareaAutosize
                                          placeholder="Log Details"
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
                                          value={logCollectionDetails}
                                          onChange={(e) =>
                                            setLogCollectionDetails(e.target.value)
                                          }
                                        />
                                      )}

                                      {selectedLogOption === "editor" && (
                                        <Editor
                                          initialValue='{logCollectionDetails}'
                                          previewStyle="vertical"
                                          height="600px"
                                          initialEditType="wysiwyg"
                                          useCommandShortcut={true}
                                          ref={editorRef}
                                          // onChange={() => {
                                          //     if (editorRef.current) {
                                          //         const editorInstance = editorRef.current.getInstance();
                                          //         setLogCollectionDetails(editorInstance.getMarkdown());
                                          //     }
                                          // }}
                                            // onChange={handleEditorChange}
                                        />
                                      )}
                                    </Grid>
                                  </Box>
                                </Grid>
                                   )}

                                </>
                                )}

          </Grid>
          
          <div className='flex justify-end'>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 14, backgroundColor: '#12a1c0', color: '#fff' }}>
              Submit Changes
            </Button>
          </div>

      </Box>
    </div>
    </div>
  )
}

export default page
