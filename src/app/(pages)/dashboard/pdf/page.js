'use client'
import { useState } from 'react';

export default function UploadForm() {
  const [files, setFiles] = useState([]);

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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
      />
      <button type="submit">Upload PDFs</button>
    </form>
  );
}
