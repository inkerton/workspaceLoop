import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// Function to initialize GridFS
let gfs, gridFSBucket;
export const initGridFS = async (db) => {
  gridFSBucket = new GridFSBucket(db, {
    bucketName: 'finalReports'
  });
  gfs = await db.collection('finalReports.files');
};

// Function to upload a file to GridFS
export const uploadFinalReport = async (db, file, incidentNo) => {
  const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
    metadata: { incidentNo },
  });

  return new Promise((resolve, reject) => {
    uploadStream.end(file.buffer, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Function to find a file by incident number
export const findFinalReport = async (db, incidentNo) => {
  return gfs.find({ 'metadata.incidentNo': incidentNo }).toArray();
};

// Function to download a file by file ID
export const downloadFinalReport = async (db, id) => {
  return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};
