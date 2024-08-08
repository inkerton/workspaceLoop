'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, MenuItem, ListItemIcon, lighten } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import OpenIncidents from '@/app/components/OpenIncidents';

const Dashboard = () => {
  const router = useRouter();

  const [incidentsData, setIncidentsData] = useState([]);

  const getIncidents = async ()=>{
    try {

      const response = await axios.get('/api/newincident');
      const data = response.data.data;
      console.log(data);
      setIncidentsData(data);
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
      (incident) => incident.status !== 'CLOSED'
    );

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
              <Typography variant='h6'>
                Total Incidents: XX
              </Typography>
              <Typography variant='h6'>
                Incidents Closed: XX
              </Typography>
              <Typography variant='h6'>
                Incidents Open: XX
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

    </Box>
      <Footer/>
    </div>
  );
};

export default Dashboard;


