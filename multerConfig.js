// config/multerConfig.js
import multer from 'multer';
import GridFSStorage from 'multer-gridfs-storage';
import path from 'path';
import mongoose from 'mongoose';

const storage = new GridFSStorage({
    url: process.env.MONGO_URI, // MongoDB connection URI
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return {
            bucketName: 'pdfFiles',
            filename: `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
        };
    },
});

const upload = multer({ storage });

export default upload;
