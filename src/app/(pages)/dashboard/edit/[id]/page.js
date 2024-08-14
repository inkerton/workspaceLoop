import React from 'react'
import chipOptions from '@/app/components/chipOptions';

function page() {

    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [status, setStatus] = useState("ASSIGNED");


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



      const handleSelectionChange = (event, value) => {
        setAssignedTo(value);
      };
    
      const handleUpdate = async () => {
        try {
          const response = await axios.put("/api/newincident", {
            incidentNo,
            assignedTo,
            status,
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
    </div>
  )
}

export default page
