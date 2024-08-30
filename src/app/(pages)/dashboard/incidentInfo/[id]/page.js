"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import chipOptions from "@/app/components/Options/chipOptions";
import axios from "axios";
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
  Autocomplete,
  Chip,
  List,
  ListItem,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
// import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/react-editor";
import { toast } from "react-toastify";

function page({ params }) {
  const router = useRouter();
  const currentID = params.id;
  console.log(currentID);
  const [incidentData, setIncidentData] = useState([]);
  console.log("incdata", incidentData);
  // setIncidentNo(currentID);

  const [incidentNo, setIncidentNo] = useState(currentID);
  const [status, setStatus] = useState("ASSIGNED");
  const [TTPDetails, setTTPDetails] = useState([]);
  const [entryPointOfContactName, setEntryPointOfContactName] = useState("");
  const [entryPointOfContactNumber, setEntryPointOfContactNumber] =
    useState("");
  const [logCollectionDetails, setLogCollectionDetails] = useState("");
  const [artifacts, setArtifacts] = useState("");
  const [miscellaneousInfo, setMiscellaneousInfo] = useState("");
  const [pdfFiles, setPdfFiles] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  const [selectedLogOption, setSelectedLogOption] = useState("");
  const editorRef = React.createRef(null);

  const formattedDate = new Date(incidentData.dateOfInput).toLocaleString();

  // const [formData, setFormData] = useState( new FormData());

  const handleLogOptionChange = (event) => {
    setSelectedLogOption(event.target.value);
  };

  // const handleEditorChange = () => {
  //   if (editorRef.current) {
  //     const editorInstance = editorRef.current.getInstance();
  //     console.log("instNCE", editorInstance);
  //     setLogCollectionDetails(editorInstance.getMarkdown().toLocaleString());
  //     console.log('object from handle editor', logCollectionDetails);
  //     console.log('object of type', typeof(logCollectionDetails));
  //   }
  // };

  const getIncidentInfo = async (incidentNo) => {
    try {
      const response = await axios.get(
        `/api/incidents/?incidentNo=${encodeURIComponent(incidentNo)}`
      );
      const data = response.data.data;
      console.log("incidents data", data);

      setIncidentData(data);
      setIncidentNo(data.incidentNo);

      if (response.status == 200) {
        return toast.success("fetched successfully");
      } else {
        console.log("something went wrong");
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (currentID) {
      getIncidentInfo(currentID);
    }
  }, [currentID]);

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

  const handleFileChange = (event) => {
    setPdfFiles(Array.from(event.target.files));
  };

  const handlesingleFileChange = (event) => {
    setFinalReport(event.target.files);
  };

  console.log(JSON.stringify(TTPDetails));
  // console.log("brief", logCollectionDetails);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (editorRef.current) {
    //   const editorInstance = editorRef.current.getInstance();
    //   setLogCollectionDetails(editorInstance.getMarkdown().toString());
    // }
    console.log("brief", logCollectionDetails);

    const formData = new FormData();
    formData.append("incidentNo", incidentNo);
    console.log(formData);
    formData.append("entryPointOfContactName", entryPointOfContactName);
    console.log(formData);
    formData.append("entryPointOfContactNumber", entryPointOfContactNumber);
    formData.append("logCollectionDetails", logCollectionDetails);
    console.log("object", logCollectionDetails);
    formData.append("artifacts", artifacts);
    formData.append("miscellaneousInfo", miscellaneousInfo);
    formData.append("TTPDetails", JSON.stringify(TTPDetails));
    const allpdf = [];

    pdfFiles.forEach((file, index) => {
      allpdf.push({ [`pdfFiles[${index}]`]: file });
      console.log("ffiillee", file);
    });
    formData.append("allpdf", allpdf);
    console.log("json pdf", allpdf);

    // await new Promise((resolve) => setTimeout(resolve, 0));
    // formData.append("logCollectionDetails", logCollectionDetails);

    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    try {
      const response = await axios.post("/api/incidentInfo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      if (response.status == 200) {
        console.log("Incident info stored successfully");
        toast.success("Incident info stored successfully");
      } else {
        toast.error("Could not Store info");
      }
      // Handle success or redirect, if needed
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();

  //   if (editorRef.current) {
  //     const editorInstance = editorRef.current.getInstance();
  //     setLogCollectionDetails(editorInstance.getMarkdown().toString());
  //   }
  //   try {
  //     formData.append('artifacts',artifacts);
  //     console.log(formData);
  //     console.log("Artifacts:", formData.get('artifacts'));
  //     const response = await axios.post("/api/incidentInfo", formData, {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           });
  //           console.log("Response:", response.data);

  //   } catch (error){
  //     console.log(error);
  //   }
  // };

  // Flatten options with group info
  const options = chipOptions.flatMap((group) =>
    group.options.map((option) => ({
      ...option,
      group: group.group,
    }))
  );

  console.log("loggy", logCollectionDetails);

  return (
    <div>
      <div className="p-4">
        <Card>
          <CardContent>
            <Typography
              variant="h4"
              color={"#12a1c0"}
              className="p=2"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              {currentID}
            </Typography>
            <Divider />

            <div>
              <section>
                <div className="p-4">
                  <Grid container spacing={2}>
                    {/* ttp details */}
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
                                placeholder="Add TTP Details "
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

                    {/* point of contact */}
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

                    {/* Log collection Radio button */}
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
                              //   initialValue="These are the formats for all! Add image like this:- ![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png) In WYSIWYG, right click on the table for more options... For more information visit [Editor](https://github.com/nhn/tui.editor). "
                              previewStyle="vertical"
                              height="600px"
                              initialEditType="wysiwyg"
                              useCommandShortcut={true}
                              ref={editorRef}
                              onChange={() => {
                                if (editorRef.current) {
                                  const editorInstance =
                                    editorRef.current.getInstance();
                                  setLogCollectionDetails(
                                    editorInstance.getMarkdown()
                                  );
                                }
                              }}
                              // onChange={handleEditorChange}
                            />
                          )}
                        </Grid>
                      </Box>
                    </Grid>

                    {/* Artfacts */}
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

                    {/* Miscellaneous info */}
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

                    {/* initial report */}
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
                          <Typography variant="h6">Initial Reports:</Typography>
                        </Grid>

                        <Grid item xs={9}>
                          <input
                            type="file"
                            accept=".pdf, .docx"
                            multiple
                            onChange={handleFileChange}
                            style={{
                              marginBottom: "1rem",
                            }}
                          />
                          <List>
                            {pdfFiles.map((file, index) => (
                              <ListItem key={index}>{file.name}</ListItem>
                            ))}
                          </List>
                        </Grid>
                      </Box>
                    </Grid>

                    {/* final report */}
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
                          <Typography variant="h6">Final Report:</Typography>
                        </Grid>

                        <Grid item xs={9}>
                          <input
                            type="file"
                            accept=".pdf, .docx"
                            onChange={handlesingleFileChange}
                            style={{
                              marginBottom: "1rem",
                            }}
                          />
                          <List>
                            {/* {pdfFiles.map((file, index) => (
                                                        <ListItem key={index}>{file.name}</ListItem>
                                                    ))} */}
                            <ListItem>{finalReport}</ListItem>
                          </List>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </section>
            </div>

            <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#12a1c0",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0F839D",
                },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
