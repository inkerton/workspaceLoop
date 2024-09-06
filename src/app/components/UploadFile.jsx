import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const FileUploadComponent = ({ incidentNo }) => {
  const [fileCount, setFileCount] = useState(0); // To store the number of files
  const [files, setFiles] = useState([]); // To store the selected files
  const router = useRouter();
  const [fileNames, setFileNames] = useState([]); // To store the retrieved file names
  const [retrievedFiles, setRetrievedFiles] = useState([]); // To store the retrieved file data
  const [role, setRole] = useState("");
  console.log('role',role)

  const handleGetCookie = () => {
    const cookie = Cookies.get("role");
    setRole(cookie);
  };

  // Handle change in file count input
  const handleFileCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setFileCount(count);
    setFiles(new Array(count).fill(null));
  };

  // Handle file selection
  const handleFileChange = (e, index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = e.target.files[0];
    setFiles(updatedFiles);
  };

  // Handle file upload
  const handleFileUpload = async (file, index) => {
    if (!file) {
      alert(`Please select a file for PDF ${index + 1}`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("incidentNo", incidentNo); // Include the incidentNo in the request

    try {
      const response = await axios.post("/api/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(`File ${index + 1} uploaded successfully`);
      } else {
        alert(`Failed to upload File ${index + 1}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading File ${index + 1}`);
    }
  };

  const handleGetFileNames = async () => {
    try {
      const response = await axios.get(`/api/files?incidentNo=${incidentNo}`);
      if (response.status === 200) {
        setFileNames(response.data.map((file) => file.filename));
      } else {
        console.error("Failed to fetch file names");
      }
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  // Fetch files associated with the incident
  const handleGetFiles = async () => {
    try {
      const response = await axios.get(`/api/fileData?incidentNo=${incidentNo}`);
      if (response.status === 200) {
        setRetrievedFiles(response.data);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    handleGetFileNames();
    handleGetFiles();
    handleGetCookie();
  }, [incidentNo]);

  return (
    <div>
      <TextField
        label="Number of Files"
        type="number"
        value={fileCount}
        onChange={handleFileCountChange}
        sx={{ mb: 2 }}
      />

      {Array.from({ length: fileCount }, (_, index) => (
        <div key={index} style={{ marginBottom: "16px" }}>
          <input
            type="file"
            name={`pdf${index + 1}`}
            onChange={(e) => handleFileChange(e, index)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleFileUpload(files[index], index)}
            sx={{ ml: 2 }}
          >
            Upload PDF {index + 1}
          </Button>
        </div>
      ))}

{fileNames.length > 0 && (
    <>
      <Typography
              variant="h6"
            //   className="p-2"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Uploaded Files
            </Typography>
      <ul>
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
      </>
      )}

      {/* <h3>Retrieved Files</h3>
      <ul>
                {retrievedFiles.map((file, index) => (
                    <li key={index}>
                        {file.fileData && file.fileData.data ? (
                            <a
                                href={`data:${file.contentType};base64,${btoa(
                                    new Uint8Array(file.fileData.data).reduce(
                                        (data, byte) => data + String.fromCharCode(byte),
                                        ''
                                    )
                                )}`} 
                                download={file.filename}
                            >
                                {file.filename}
                            </a>
                        ) : (
                            <span>Error loading file data</span>
                        )}
                    </li>
                ))}
            </ul> */}

        {role === 'Admin' && retrievedFiles.length > 0 && (
            <div className="mt-4">
                <Typography
              variant="h6"
            //   className="p-2"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Download Files
            </Typography>
            {retrievedFiles.map((file, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{file.filename}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: "#12a1c0",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "#0F839D",
                                },
                              }}
                            onClick={() => {
                                const downloadLink = document.createElement('a');
                                downloadLink.href = `data:${file.contentType};base64,${btoa(
                                    new Uint8Array(file.fileData.data).reduce(
                                        (data, byte) => data + String.fromCharCode(byte),
                                        ''
                                    )
                                )}`;
                                downloadLink.download = file.filename;
                                downloadLink.click();
                            }}
                        >
                            Download
                        </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
            )}
    </div>
  );
};

export default FileUploadComponent;
