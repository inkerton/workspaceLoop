import { createRouter } from 'next-connect';
import multer from 'multer';
import dbConnect from '@/utils/mongodb';
import File from '@/model/FileSchema';

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = createRouter();
router.use(upload.array('pdfs'));

router.post(async (req, res) => {
  try {
    await dbConnect();
    console.log('req',req)

    const files = req.files.map(file => ({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    }));

    await File.insertMany(files);

    res.status(201).json({ message: 'Files uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading files.' });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};

export default router.handler();
