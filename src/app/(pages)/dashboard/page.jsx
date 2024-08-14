'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, MenuItem, ListItemIcon, lighten } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import OpenIncidents from '@/app/components/OpenIncidents';
import ClosedIncidents from '@/app/components/ClosedIncidents';

const Dashboard = () => {
  const router = useRouter();

  const [incidentsData, setIncidentsData] = useState([]);
  const [totalIncidents, setTotalIncidents] = useState('');

  const getIncidents = async ()=>{
    try {

      const response = await axios.get('/api/newincident');
      const data = response.data.data;
      console.log(data);
      console.log('len',response.data);
      setIncidentsData(data);
      setTotalIncidents(response.data.count);
      console.log('object',totalIncidents)
      if(response.status == 200){
        return alert("incidents fetched successfully");
      }
      return alert("fetching failed");

    } catch(error) {
      console.log(error);
    }
  };

  useEffect(()=> {
    getIncidents();
  }, [])

    // Filter the incidentsData where status is not 'CLOSED'
    const openIncidentsData = incidentsData.filter(
      (incident) => incident.status !== 'CLOSED_INCIDENT'
    );

    //Filter the incidentsDara where status is 'CLOSED'
    const closedIncidentsData = incidentsData.filter(
      (incident) => incident.status == 'CLOSED_INCIDENT'
    )

    const openIncidentsCount = openIncidentsData.length;
    const closedIncidentsCount = closedIncidentsData.length;

    // console.log('cid',closedIncidentsData);
    // console.log('Number of Open Incidents:', openIncidentsCount);
    // console.log('Number of Closed Incidents:', closedIncidentsCount);

  return (
    <div>
    <Box 
      sx={{ 
        backgroundColor: '#f0f4f8', // Light background color
        minHeight: '100vh', // Ensure the background color covers the full height
        padding: 2 // Optional padding for better spacing
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card sx={{ boxShadow: 'sm' }} className='shadow-md'>
            <CardContent>
              <Typography variant='h6' color={'black'} sx={{ fontWeight: 'bold'}} >
                Total Incidents: <span style={{ color: '#12a1c0', fontWeight: 'bold' }}>{totalIncidents}</span>
              </Typography>
              <Typography 
              variant='h6' 
              color={'#12a1c0'} 
              sx={{ fontWeight: 'bold'}}
              >
                Incidents Closed: <span style={{ color: 'black', fontWeight: 'bold' }}>{closedIncidentsCount}</span>
              </Typography>
              <Typography variant='h6' color={'#12a1c0'} sx={{ fontWeight: 'bold'}} >
                Incidents Open: <span style={{ color: 'black', fontWeight: 'bold' }}>{openIncidentsCount} </span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className='shadow-md'>
            <CardContent>
              <Typography variant='h6'>
                Average Closing Time: XX
              </Typography>
              <Typography variant='h6'>
                Max Closing Time: XX
              </Typography>
              <Typography variant='h6'>
                Min Closing Time: XX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

        <div>
        {/* Pass the filtered data to OpenIncidents component */}
        <OpenIncidents data={openIncidentsData} />
        </div>

        <div>
          {/* Pass the filtered data to ClosedIncidents component */}
          <ClosedIncidents data={closedIncidentsData} />
        </div>

    </Box>
      <Footer/>
    </div>
  );
};

export default Dashboard;