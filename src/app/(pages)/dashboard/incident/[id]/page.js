'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography, Grid, TextField, MenuItem,  Tooltip, Autocomplete, Chip, List, ListItem } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
// import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';




function page({ params }) {
    const router = useRouter()
    const currentID = params.id;
    console.log(currentID)
    const [incidentData, setIncidentData] = useState([]);
    console.log('incdata',incidentData);

    const [brief, setBrief] = useState('');
    const [ status, setStatus] = useState('ASSIGNED');
    const [ TTPDetails, SetTTPDetails] = useState([]);
    const [ entryPointOfContactName, setEntryPointOfContactName] = useState('')
    const [ entryPointOfContactNumber, setEntryPointOfContactNumber] = useState('')
    const [ logCollectionDetails, setLogCollectionDetails] = useState('');
    const [ artifacts, setArtifacts] = useState('');
    const [ miscellaneousInfo, setMiscellaneousInfo] = useState('');
    const [ pdfFiles, setPdfFiles] = useState([]);



    const chipOptions = [
        { value: 'tcp1', info: 'value' },
        { value: 'tcp2', info: 'tcp is this' }
    ];




    const getIncidentInfo = async (incidentNo) => {
        try {
            const response = await axios.get(`/api/incidents/?incidentNo=${encodeURIComponent(incidentNo)}`);
            const data = response.data.data;
            console.log('incidents data', data);

            setIncidentData(data);
            
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
        }
    }, [currentID]);

    const handleTTPDetailsChange = (event, value) => {
        const selectedTTPs = value.map(val => chipOptions.find(option => option.value === val) || { value: val, info: 'No info available' });
        SetTTPDetails(selectedTTPs);
    };

    const handleFileChange = (event) => {
        setPdfFiles(Array.from(event.target.files));
    };

    console.log(JSON.stringify(TTPDetails))
    console.log('brief', logCollectionDetails)

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('status', status);
        formData.append('logCollectionDetails', logCollectionDetails);
        formData.append('TTPDetails', JSON.stringify(TTPDetails));
        pdfFiles.forEach((file, index) => {
            formData.append(`pdfFiles[${index}]`, file);
        });

        try {
            const response = await axios.post('/api/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            // Handle success or redirect, if needed
        } catch (error) {
            console.log('Error uploading data:', error);
        }
    };

  return (
    <div>
        <div className='p-4'>
            <Card>
                    <CardContent>
                        <Typography 
                        variant='h4' 
                        color={'#12a1c0'} 
                        className='p=2'
                        sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            {currentID}
                        </Typography>
                        <Divider/>

                        <section className='mt-2 mb-2'>
                        <Typography>
                            <span className='font-medium'>Input Source:</span> {incidentData.inputSource}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Date of Input:</span> {incidentData.dateOfInput}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Entity Impacted:</span> {incidentData.entityImpacted}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Category:</span> {incidentData.category}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Incident Brief:</span> {incidentData.brief}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Assigned To:</span> {incidentData.assignedTo}
                        </Typography>
                        <Typography>
                            <span className='font-medium'>Initial Comment:</span> {incidentData.comment}
                        </Typography>
                        </section>

                        <Divider/>

                        <div className='p-4'>
                        <Grid container spacing={2}>

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
                            
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Grid item xs={3}>
                                    <Typography variant="h6">
                                        TTP Details:
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Autocomplete
                                        multiple
                                        id="tags-filled"
                                        options={chipOptions.map(option => option.value)}
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
                                    />
                                </Grid>
                                </Box>
                            </Grid>

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

                            <Grid item xs={12}>
                            <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>

                                <Grid item xs={3}>
                                <Typography variant="h6" >
                                Log Collection Details:
                                </Typography>
                                </Grid>

                                <Grid item xs={9}>
                                 <TextareaAutosize
                                            placeholder='Log Details'
                                            minRows={2}
                                            maxRows={200}
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
                                </Grid>
                            </Box>
                            </Grid>

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
                                            value={artifacts}
                                            onChange={(e) => setArtifacts(e.target.value)}
                                        />
                                </Grid>
                            </Box>
                            </Grid>

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
                                            value={miscellaneousInfo}
                                            onChange={(e) => setMiscellaneousInfo(e.target.value)}
                                        />
                                </Grid>
                            </Box>
                            </Grid>

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

                        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>

                    </CardContent>
                </Card>
        </div>
    </div>
  )
}

export default page
