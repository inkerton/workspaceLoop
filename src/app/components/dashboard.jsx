'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenIncidents from '@/app/components/OpenIncidents';

const Dashboard = () => {
  const [incidentsData, setIncidentsData] = useState([]);

  const getIncidents = async () => {
    try {
      const response = await axios.get('/api/newincident');
      const data = response.data.data;
      console.log(data);
      setIncidentsData(data);

      if (response.status === 200) {
        alert('Incidents fetched successfully');
      } else {
        alert('Fetching failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIncidents();
  }, []);

  // Filter the incidentsData where status is not 'CLOSED'
  const openIncidentsData = incidentsData.filter(
    (incident) => incident.status !== 'CLOSED'
  );

  return (
    <div>
      {/* Pass the filtered data to OpenIncidents component */}
      <OpenIncidents data={openIncidentsData} />
    </div>
  );
}

export default Dashboard;


// <div className='flex justify-end'>
//                                 <Button 
//                                 variant="contained" 
//                                 color="primary" 
//                                 sx={{mr: 4, backgroundColor: '#12a1c0', color: '#fff' }}
//                                 onClick={handleUpdate} 
//                                 >
//                                 Update
//                                 </Button>
//                             </div>