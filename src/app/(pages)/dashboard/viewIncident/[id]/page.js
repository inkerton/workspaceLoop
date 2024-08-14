'use client'
import React, {useState, useEffect} from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, Grid, TextField, MenuItem, FormControl, FormControlLabel, Radio, ListSubheader, RadioGroup, Tooltip, Autocomplete, Chip, List, ListItem, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';



function ViewIncident({ params }) {
    const currentID = params.id;
    console.log(currentID);
    const router = useRouter();
    const [incidentData, setIncidentData] = useState([]);
    const [incidentInfo, setIncidentInfo] = useState(null);
    const [assignedTo, setAssignedTo] = useState([]);
    const [incidentNo, setIncidentNo] = useState('');
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const formattedDate = new Date(incidentData.dateOfInput).toLocaleString();

    const statusMapping = {
        ASSIGNED: "Assigned",
        UNASSIGNED: "Unassigned",
        INFORMATION_AWAITED: "Information Awaited",
        PROCESSING: "Processing",
        TEAM_SENT: "Team Sent",
        REPORT_BEING_PREPARED: "Report Being Prepared",
        CLOSED_INCIDENT: "Closed Incident",
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

    const getIncidentInfo = async (incidentNo) => {
        try {
            const response = await axios.get(`/api/incidents/?incidentNo=${encodeURIComponent(incidentNo)}`);
            const data = response.data.data;
            console.log('incidents data', data);

            setIncidentData(data);
            setAssignedTo(data.assignedTo);
            setIncidentNo(data.incidentNo);

            if (response.data.additionalInfo) {
                const additionalInfo = response.data.additionalInfo;
                console.log('additionalInfo', additionalInfo);
                // setIncidentInfo(additionalInfo);
                setIncidentInfo(response.data.additionalInfo || null);
                // setAdditionalInfo(additionalInfo);
                // handleTTPDetails(additionalInfo.TTPDetails);
                // setEntryPointOfContactName(additionalInfo.entryPointOfContactName);
            }
            
            if (response.status == 200) {
                // return alert('fetched successfully');
                console.log('success');
            } else {
                console.log('something went wrong')
            }
        }  catch(error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (currentID) {
            getIncidentInfo(currentID);
            getUsers();
        }
    }, [currentID]);

  return (
    <div>
        <div className='p-4'>
            <Card>
                    <CardContent>
                        <div className='flex justify-between'>
                            <Typography 
                            variant='h4' 
                            color={'#12a1c0'} 
                            className='p-2'
                            sx={{ fontWeight: 'bold', mb: 2 }}
                            >
                                {incidentNo}
                            </Typography>
                            
                            <IconButton aria-label="back" size='large' onClick={() => router.push('/dashboard')} sx={{ mr: 4, mb: 2 }} >
                                <ArrowBackIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                        <Divider/>

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
                                            label="Status"
                                            value={statusMapping[incidentData.status] || ''}
                                            margin="normal"
                                            fullWidth
                                            sx={{ flexGrow: 1, backgroundColor: 'white' }}
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
                                                    placeholder="Selected team"
                                                    fullWidth
                                                    sx={{ flexGrow: 1, backgroundColor: 'white' }}
                                                />
                                            )}
                                        />
                                        </Grid>
                                        

                                        </Box>
                                    </Grid>

                            </Grid>
                            

                            </CardContent>
                        </Card>

                        <div>
                            <section>
                                <div className='p-4'>
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
                                                fullWidth
                                                options={incidentInfo.TTPDetails.map(ttp => `${ttp.value} - ${ttp.info}`)}
                                                getOptionLabel={(option) => option}
                                                value={incidentInfo.TTPDetails.map(ttp => `${ttp.value} - ${ttp.info}`)}
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
                                                        label="TTP Details"
                                                        placeholder="Selected TTP details"
                                                        fullWidth
                                                        sx={{ flexGrow: 1, backgroundColor: 'white' }}
                                                    />
                                                )}
                                            />
                                            </Grid>
                                            {/* <Grid item xs={9}>
                                                {incidentInfo.TTPDetails.map((ttp, index) => (
                                                <Chip
                                                    key={index}
                                                    label={`${ttp.value} - ${ttp.info}`}
                                                    variant="outlined"
                                                    sx={{ mb: 1, mr: 1 }} // Adding margin bottom and right for spacing
                                                />
                                                ))}
                                            </Grid> */}
                                            </Box>
                                        </Grid>
                                    ) : null}

                                    {/* Grid item for Artifacts  */}
                                    <Grid item xs={12}>
                                        <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

                                        <Grid item xs={3}>
                                        <Typography variant="h6" >
                                        Artifacts:
                                        <Tooltip title="Read only">
                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to mamke it superscript */}
                                        </Tooltip>
                                        </Typography>
                                        </Grid>
                                        <Grid item xs={9}>

                                        <TextareaAutosize
                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px', }}
                                        value={incidentInfo.artifacts}
                                        readOnly
                                        />
                                        </Grid>

                                        </Box>
                                    </Grid>

                                    {/* Grid item for Miscellaneous Info */}
                                    {incidentInfo.miscellaneousInfo && (
                                        <Grid item xs={12}>
                                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        Miscellaneous Info:
                                                        <Tooltip title="Read only">
                                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to make it superscript */}
                                                        </Tooltip>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <TextareaAutosize
                                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px' }}
                                                        value={incidentInfo.miscellaneousInfo || ''}
                                                        readOnly
                                                    />
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    )}

                                    {/* Grid item for entryPointOfContact  */}
                                    {incidentInfo.entryPointOfContactName && (
                                        <Grid item xs={12}>
                                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Grid item xs={3}>
                                                    <Typography variant="h6">
                                                        Entity Point of Contact:
                                                        <Tooltip title="Read only">
                                                            <InfoIcon fontSize="small" color="disabled" /> {/* sx={{ verticalAlign: 'super' }} to make it superscript */}
                                                        </Tooltip>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextareaAutosize
                                                        label='Name'
                                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px' }}
                                                        value={incidentInfo.entryPointOfContactName || ''}
                                                        readOnly
                                                        />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextareaAutosize
                                                        style={{ width: '100%', border: '1px solid lightgray', borderRadius: '4px', padding: '8px' }}
                                                        value={incidentInfo.entryPointOfContactNumber || ''}
                                                        readOnly
                                                    />
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    )}

                                   


                                </>
                                )}

                                    

                                    

                                    </Grid>
                                </div>
                            
                            </section>
                        </div>

                        

                        

                        <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => router.push('/dashboard')} 
                        startIcon={<ArrowBackIcon />}
                        >
                        Go back to Dashboard
                        </Button>

                    </CardContent>
                </Card>
        </div>
    </div>
  )
}

export default ViewIncident