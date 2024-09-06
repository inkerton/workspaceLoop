'use client'
import React, { useState } from 'react';

function Files() {
  const [selectedFiles, setSelectedFiles] = useState([]); // Array to store selected files

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFiles.length) {
      console.error('No files selected!');
      return;
    }

    const formData = new FormData();
    for (const [index, file] of selectedFiles.entries()) {
      formData.append(`file[${index}]`, file); // Append files with indices
    }


    // Log the FormData content
    for (const [key, value] of formData.entries()) {
        console.log('formdata',key, value);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.data;
    // const json = await response.json();
    console.log('Upload response:', response); 
    console.log('Upload response data:', data); 
    // console.log('Upload response json:', json); 


    // Clear selected files after successful upload (optional)
    setSelectedFiles([]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf, .docx"
          multiple
          method="POST"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Files;
