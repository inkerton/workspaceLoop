'use client'
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);

  const handleGetIncidentsCount = async () => {
    console.log("Button clicked");
    try {
      const response = await axios.get('/api/count');
      console.log("API response received");
      const data = response.data.count;
      console.log(data);
      if(response.status == 200){
        setIndex(data+1);
        toast("Data fetched successfully");
      } else {
        toast("Could not get document count");
      }
    } catch(error) {
      console.log("Error:", error);
    }
  };
  

  // useEffect(()=> {
  //   getIncidentsCount();
  // }, []);

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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />
      <button type="submit">Upload PDFs</button>
    </form>
    <br></br><br></br>
    <Button onClick={handleGetIncidentsCount}>Get Count (Initial Fetch)</Button>
    <Button onClick={handleGetIncidentsCount}>Refresh Count</Button>
    <p className='p-4'>{index}</p>
    </div>
  );
}
