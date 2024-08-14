import React from 'react'

function extra_components() {

    // SECOND DIV COMPONENTS
    const [ status, setStatus] = useState('ASSIGNED');
    const formattedDate = new Date(incidentData.dateOfInput).toLocaleString();
    const [assignedToOptions, setAssignedToOptions] = useState([])
    const [assignedTo, setAssignedTo] = useState([]);

    const handleSelectionChange = (event, value) => {
        setAssignedTo(value); 
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put('/api/newincident', {
                incidentNo,
                assignedTo,
                status});
            if (response.status === 200) {
                alert('Incident updated successfully');
            } else {
                alert('Failed to update incident');
            }
        } catch (error) {
            console.log(error);
            alert('An error occurred while updating the incident');
        }
    };

    const getUsers = async ()=>{
        try {
          const response = await axios.get('/api/auth');
          const data = response.data.data;
          console.log(data);
          if(response.status == 200){
            const userOptions = data.map(user => user.username);
            console.log(userOptions);
            setAssignedToOptions(userOptions);
            alert("data fetched successfully");
          } else {
            alert("could not get document count");
          }
    
        } catch(error) {
          console.log(error);
        }
      };

      useEffect(() => {
            getUsers();
    }, [currentID]);


  return (
    <div>
      <div className='p-4'>
                        <Grid container spacing={2}>

                            {/* status */}
                            <Grid item xs={12}>
                                <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Status:
                                </Typography>
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
                                sx={{ flexGrow: 1}}
                                >
                                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                                <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
                                <MenuItem value="INFORMATION_AWAITED">Information Awaited</MenuItem>
                                <MenuItem value="PROCESSING">Processing</MenuItem>
                                <MenuItem value="TEAM_SENT">Team Sent</MenuItem>
                                <MenuItem value="REPORT_BEING_PREPARED">Report Being Prepared</MenuItem>
                                </TextField>
                                </Grid>

                                </Box>
                            </Grid>
                            
                            {/* ttp details */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Grid item xs={3}>
                                    <Typography variant="h6">
                                        TTP Details:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    {/* <Autocomplete
                                        multiple
                                        id="tags-filled"
                                        // options={chipOptions.map(option => option.value)}
                                        // options={chipOptions.flatMap(group => group.options.map(option => option.value))}
                                        options={chipOptions.map(group => group.options.map(option => option.value))}
                                        // options={chipOptions.map((group, groupIndex) => (
                                        //     <React.Fragment key={groupIndex}>
                                        //         <ListSubheader>{group.group}</ListSubheader>
                                        //         {group.options.map((option, optionIndex) => (
                                        //             <MenuItem key={optionIndex} value={option.value} data-info={option.info}>
                                        //                 {option.value}
                                        //             </MenuItem>
                                        //         ))}
                                        //     </React.Fragment>
                                        // ))}
                                        defaultValue={[]}
                                        freeSolo
                                        onChange={handleTTPDetailsChange}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const chipOption = TTPDetails.find(o => o.value === option);
                                                return (
                                                    <Tooltip title={chipOption ? chipOption.info : ''} key={index}>
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
                                    /> */}

                                    <Autocomplete
                                        multiple
                                        id="tags-filled"
                                        options={options.map(option => option.value)}  // Use only the value for the options prop
                                        value={TTPDetails.map(item => item.value)}  // Ensure value is an array of simple values
                                        defaultValue={[]}
                                        freeSolo
                                        onChange={handleTTPDetailsChange}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const chipOption = options.find(o => o.value === option);
                                                return (
                                                    <Tooltip title={chipOption ? chipOption.info : ''} key={index}>
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
                                            const optionData = options.find(o => o.value === option);
                                            const previousGroup = options[options.findIndex(o => o.value === option) - 1]?.group;
                                            const currentGroup = optionData?.group;
                            
                                            return (
                                                <div {...props} key={option}>
                                                    {currentGroup !== previousGroup && (
                                                        <ListSubheader>
                                                            {currentGroup}
                                                        </ListSubheader>
                                                    )}
                                                    <MenuItem value={option} data-info={optionData?.info}>
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
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Entity Point of Contact:
                                </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                 <TextareaAutosize
                                            placeholder='Name'
                                            minRows={1}
                                            maxRows={10}
                                            style={{
                                                width: '100%',
                                                border: '1px solid black',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#12a1c0'}
                                            onBlur={(e) => e.target.style.borderColor = 'black'}
                                            value={entryPointOfContactName}
                                            onChange={(e) => setEntryPointOfContactName(e.target.value)}
                                        />
                                </Grid>

                                <Grid item xs={4}>
                                 <TextareaAutosize
                                            placeholder='Number'
                                            minRows={1}
                                            maxRows={10}
                                            style={{
                                                width: '100%',
                                                border: '1px solid black',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#12a1c0'}
                                            onBlur={(e) => e.target.style.borderColor = 'black'}
                                            value={entryPointOfContactNumber}
                                            onChange={(e) => setEntryPointOfContactNumber(e.target.value)}
                                        />
                                </Grid>


                            </Box>
                            </Grid>

                            {/* Log collection Radio button */}
                            <Grid item xs={12}>
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Grid item xs={3}>
                                <Typography variant="h6">
                                    Log Collection Details:
                                </Typography>
                                </Grid>

                                <Grid item xs={9}>
                                <FormControl component="fieldset">
                                    <RadioGroup row value={selectedLogOption} onChange={handleLogOptionChange}>
                                    <FormControlLabel value="plainText" control={<Radio />} label="Plain Text" />
                                    <FormControlLabel value="editor" control={<Radio />} label="Editor" />
                                    </RadioGroup>
                                </FormControl>

                                {selectedLogOption === 'plainText' && (
                                    <TextareaAutosize
                                    placeholder='Log Details'
                                    minRows={2}
                                    maxRows={2000}
                                    style={{
                                        width: '100%',
                                        border: '1px solid black',
                                        borderRadius: '4px',
                                        padding: '8px',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#12a1c0'}
                                    onBlur={(e) => e.target.style.borderColor = 'black'}
                                    value={logCollectionDetails}
                                    onChange={(e) => setLogCollectionDetails(e.target.value)}
                                    />
                                )}

                                {selectedLogOption === 'editor' && (
                                    <Editor
                                    initialValue="These are the formats for all! Add image like this:- ![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png) In WYSIWYG, right click on the table for more options... For more information visit [Editor](https://github.com/nhn/tui.editor). "
                                    previewStyle="vertical"
                                    height="600px"
                                    initialEditType="wysiwyg"
                                    useCommandShortcut={true}
                                    onChange={() => {
                                        if (editorRef.current) {
                                            const editorInstance = editorRef.current.getInstance();
                                            setLogCollectionDetails(editorInstance.getMarkdown());
                                          }
                                    }}
                                    />
                                )}
                                </Grid>
                            </Box>
                            </Grid>

                                {/* Artfacts */}
                            <Grid item xs={12}>
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>

                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Artifacts/IOC Collection Details:
                                </Typography>
                                </Grid>

                                <Grid item xs={9}>
                                 <TextareaAutosize
                                            placeholder='Artifacts/IOC Details'
                                            minRows={2}
                                            maxRows={2000}
                                            style={{
                                                width: '100%',
                                                border: '1px solid black',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#12a1c0'}
                                            onBlur={(e) => e.target.style.borderColor = 'black'}
                                            value={artifacts}
                                            onChange={(e) => setArtifacts(e.target.value)}
                                        />
                                </Grid>
                            </Box>
                            </Grid>

                            {/* Miscellaneous info */}
                            <Grid item xs={12}>
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>

                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Miscellaneous Info.:
                                </Typography>
                                </Grid>

                                <Grid item xs={9}>
                                 <TextareaAutosize
                                            placeholder='Any Miscellaneous Info.'
                                            minRows={2}
                                            maxRows={2000}
                                            style={{
                                                width: '100%',
                                                border: '1px solid black',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#12a1c0'}
                                            onBlur={(e) => e.target.style.borderColor = 'black'}
                                            value={miscellaneousInfo}
                                            onChange={(e) => setMiscellaneousInfo(e.target.value)}
                                        />
                                </Grid>
                            </Box>
                            </Grid>

                            {/* final report */}
                            <Grid item xs={12}>
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>

                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Final Report:
                                </Typography>
                                </Grid>

                                <Grid item xs={9}>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            onChange={handleFileChange}
                                            style={{ 
                                                marginBottom: '1rem',
                                                
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

                         </Grid>
                        </div> 

                        <div>
                        <Card sx={{ backgroundColor: '#E6F9FD', mt: 2 ,mb: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                            <CardContent >
                            <Grid container spacing={2}>
                                        {/* status */}
                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Status:
                                        </Typography>
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
                                        sx={{ flexGrow: 1, backgroundColor: 'white'}}
                                        >
                                        <MenuItem value="ASSIGNED">Assigned</MenuItem>
                                        <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
                                        <MenuItem value="INFORMATION_AWAITED">Information Awaited</MenuItem>
                                        <MenuItem value="PROCESSING">Processing</MenuItem>
                                        <MenuItem value="TEAM_SENT">Team Sent</MenuItem>
                                        <MenuItem value="REPORT_BEING_PREPARED">Report Being Prepared</MenuItem>
                                        </TextField>
                                        </Grid>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Assigned To:
                                        </Typography>
                                        </Grid>

                                        <Grid item xs={9}>

                                        <Autocomplete
                                            multiple
                                            fullWidth
                                            options={assignedToOptions}
                                            getOptionLabel={(option) => option}
                                            value={assignedTo}
                                            onChange={handleSelectionChange}
                                            sx={{ flexGrow: 1, backgroundColor: 'white'}}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    label="Assigned To"
                                                    placeholder="Select users"
                                                    fullWidth
                                                    sx={{ flexGrow: 1, backgroundColor: 'white' }}
                                                />
                                            )}
                                        />
                                        </Grid>

                                        </Box>
                                    </Grid>

                            </Grid>
                            <div className='flex justify-end'>
                                <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{mr: 4, backgroundColor: '#12a1c0', color: '#fff' }}
                                onClick={handleUpdate} 
                                >
                                Update
                                </Button>
                            </div>

                            </CardContent>
                        </Card>

                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Input Source:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            // defaultValue="Hello World"
                                            value={incidentData.inputSource}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Grid item xs={3}>
                                            <Typography variant="h6">
                                            Date of Input:
                                            <Tooltip title="Read only">
                                                <InfoIcon fontSize="small" color="disabled"/>
                                            </Tooltip>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            value={formattedDate}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            />
                                        </Grid>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Entity Impacted:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            // defaultValue="Hello World"
                                            value={incidentData.entityImpacted}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Category:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            // defaultValue="Hello World"
                                            value={incidentData.category}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Incident Brief:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextareaAutosize
                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px', }}
                                        value={incidentData.brief}
                                        readOnly
                                        />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Initial Comment:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextareaAutosize
                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px', }}
                                        value={incidentData.comment}
                                        readOnly
                                        />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    <Divider/>
                        </Grid>
                        </div>
    </div>
  )
}

export default extra_components
