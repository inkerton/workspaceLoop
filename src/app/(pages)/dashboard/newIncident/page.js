'use client'
import React, { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';

const filter = createFilterOptions();


function NewIncident() {
  const [incidentNo, setIncidentNo] = useState('');
  const [inputSource, setInputSource] = useState(null);
  const [dateOfInput, setDateOfInput] = useState(null);
  const [entityImpacted, setEntityImpacted] = useState(null);
  const [category, setCategory] = useState('');
  const [brief, setBrief] = useState('');
  const [assignedTo, setAssignedTo] = useState(null);
  const [comment, setComment] = useState('');
  const [ status, setStatus] = useState('ASSIGNED');
  const [index, setIndex] = useState(0);
  const [inputSourceOptions, setInputSourceOptions] = useState([
    'mohan',
    'ram',
    'shyam',
  ]);

  const [assignedToOptions, setAssignedToOptions] = useState([
    'person1',
    'person2',
    ])

  const [ entityImpactedOptions, setEntityImpactedOptions ] = useState([
    'entity1',
    'bsnl',
    'rbi',
  ])


  const getIncidentsCount = async ()=>{
    try {
      const response = await axios.get('/api/newincident');
      const data = response.data;
      console.log(data);
      if(response.status == 200){
        setIndex(data.count+1);
        alert("data fetched successfully");
      } else {
        alert("could not get document count");
      }

    } catch(error) {
      console.log(error);
    }
  };

  useEffect(()=> {
    getIncidentsCount();
  }, []);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    setIncidentNo(`${date}IPINC${index}`);
  }, [index]);


  const handleNewInputSource = (newName) => {
    if (!inputSourceOptions.includes(newName)) {
      setInputSourceOptions([...inputSourceOptions, newName]);
    }
  };

  const handleNewEntity = ( newName ) => {
    if(!entityImpactedOptions.includes(newName)) {
      setEntityImpactedOptions([...entityImpactedOptions, newName]);
    }
  }

  const handleNewAssignedTo = ( newName ) => {
    if(!assignedToOptions.includes(newName)) {
      setAssignedToOptions([...assignedToOptions, newName]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post('/api/newincident', {
        incidentNo,
        inputSource,
        dateOfInput,
        entityImpacted,
        category,
        brief,
        assignedTo,
        status,
        comment
        });
      console.log('12121212121:',response.data);
      setIndex(index + 1);
      if(response.status == 200){
        return alert("data stored successfully");
    }
    return alert("storage failed");
      // Optionally reset the form fields after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 1000, mx: 'auto' }}>
        <div className='items-center'>
          <Typography variant="h4" gutterBottom sx={{ alignContent: 'center'}}>
            Incident Form
          </Typography>
        </div>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6"  > {/* sx={{ whiteSpace: 'nowrap'}} */}
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
                  sx={{ flexGrow: 1}}
                />
                </Grid>

              </Box>
            </Grid>

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
                    />
                  </LocalizationProvider>
                </Grid>
              </Box>
            </Grid>

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
                  options={entityImpactedOptions}
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

            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Brief:
                </Typography>
                </Grid>
                <Grid item xs={9}>

                <TextField
                  sx={{ flexGrow: 1}}
                  label="Brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
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
                  fullWidth
                  freeSolo
                  options={assignedToOptions}
                  value={assignedTo}
                  onInputChange={(event, newValue) => setAssignedTo(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      handleNewAssignedTo(newValue);
                      setAssignedTo(newValue);
                    } else if (newValue && newValue.inputValue) {
                      handleNewAssignedTo(newValue.inputValue);
                      setAssignedTo(newValue.inputValue);
                    } else {
                      setAssignedTo(newValue);
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

            <Grid item xs={12}>
              <Box className="flex" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>

              <Grid item xs={3}>
                <Typography variant="h6" >
                  Any Comments:
                </Typography>
                </Grid>
                <Grid item xs={9}>

                <TextField
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ flexGrow: 1}}
                  />
                  </Grid>
              </Box>
            </Grid>

          </Grid>
          
          <div className='items-end justify-between'>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 10, backgroundColor: '#12a1c0', color: '#fff' }}>
              Submit
            </Button>
          </div>

      </Box>
    </div>
  )
}

export default NewIncident;
