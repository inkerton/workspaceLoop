import { NextConnect } from 'next-connect';
import { NextResponse } from 'next/server';
import multer from 'multer';
import { MongoClient, GridFSBucket } from 'mongodb';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadHandler = (req, res) => {
  upload.array('files')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading files' });
    }

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = client.db(process.env.MONGODB_DB);
      const bucket = new GridFSBucket(db);

      const fileUploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
          });

          uploadStream.end(file.buffer);

          uploadStream.on('finish', () => resolve(uploadStream.id));
          uploadStream.on('error', reject);
        });
      });

      const fileIds = await Promise.all(fileUploadPromises);

      res.status(200).json({ message: 'Files uploaded successfully', fileIds });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading files' });
    }
  });
};

export async function POST(req) {
  const res = NextResponse.next();
  await uploadHandler(req, res);
  return res;
}
