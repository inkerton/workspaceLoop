'use client'
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DrawerComponent from '@/app/components/Drawer';
import FileUploadComponent from '@/app/components/UploadFile';

export default function UploadForm({ params }) {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [incidentNo, setIncidentNo] = useState('');
  const [openModal, setOpenModal] = useState(true);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const getIncidentsCount = async () => {
    try {
      const response = await axios.get("/api/count");
      const data = response.data;
      if (response.status === 200) {
        setIndex(data.count + 1);
      } else {
        toast.error("Could not get document count");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIncidentsCount();
}, []);

  const handleIncidentTypeSelect = async (type) => {
    await getIncidentsCount();
    if (type === 'internal') {
      setIncidentNo(`IR_NCI_NN_${index}`);
    } else if (type === 'external') {
      setIncidentNo(`IR_NN_EEE_${index}`);
    }
    setOpenModal(false);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <div>
      {/* Modal for incident type selection */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Select Incident Type</DialogTitle>
        <DialogContent>
          {/* Internal Incident Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: "#12a1c0",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0F839D",
              },
            }}
            onClick={() => handleIncidentTypeSelect('internal')}
          >
            Internal Incident
          </Button>

          {/* External Incident Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: "#12a1c0",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0F839D",
              },
            }}
            onClick={() => handleIncidentTypeSelect('external')}
          >
            External Incident
          </Button>
        </DialogContent>
      </Dialog>

      {/* File Upload Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
        />
        <button type="submit">Upload PDFs</button>
      </form>

      {/* Buttons for fetching count */}
      <Button onClick={getIncidentsCount}>Refresh Count</Button>
      <Typography variant="h6" className='p-4'>Incident No: {incidentNo}</Typography>

      {/* Drawer */}
      <Button onClick={handleDrawerOpen}>Open Drawer</Button>
      <DrawerComponent open={drawerOpen} onClose={handleDrawerClose} />

      {/* File Upload */}
      <FileUploadComponent incidentNo={incidentNo} />
    </div>
  );
}
