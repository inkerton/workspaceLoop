// import dbConnect from '@/utils/mongodb';
// import File from '@/model/FileSchema';
// import multer from 'multer';
// import { NextResponse } from 'next/server';

// const storage = multer.memoryStorage();
// const upload = multer({ storage }).array('file');

// export const config = {
//   api: {
//     bodyParser: false, // Disables Next.js's default body parsing so multer can handle it
//   },
// };

// const runMiddleware = (req, res, fn) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// };

// export const POST = async (req, res) => {
//   await dbConnect();

//   try {
//     await runMiddleware(req, res, upload);
//     console.log('req',req)
    
//     const formData = await req.formData();
//     console.log('formdata',formData)

//     const files = formData.file;
//     console.log('Received files:', files);

//     if (!files || files.length === 0) {
//       return new NextResponse(JSON.stringify({ message: 'No files uploaded.' }), { status: 400 });
//     }

//     const uploadedFiles = [];
//     for (const [index, file] of files.entries()) {
//       const newFile = new File({
//         filename: file.originalname,
//         contentType: file.mimetype,
//         data: file.buffer,
//         index,
//       });

//       await newFile.save();
//       uploadedFiles.push(newFile);
//     }

//     return new NextResponse(
//       JSON.stringify({ message: 'Files uploaded successfully!', files: uploadedFiles }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Server error:', error);
//     return new NextResponse(
//       JSON.stringify({ message: 'Internal Server Error', error }),
//       { status: 500 }
//     );
//   }
// };





// pages/api/upload.js
import dbConnect from '@/utils/mongodb';
import * as formidable from 'formidable';
import fs from 'fs';
import mongoose from 'mongoose';
import { Readable } from 'stream';


const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, formidable will handle it
  },
};

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ error: 'Database connection error' }), { status: 500 });
  }

  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  const buffer = Buffer.concat(buffers);
  const stream = bufferToStream(buffer);

  // const form = new formidable.IncomingForm();
  const form = formidable({ multiples: true }); // uploaded files will be an array

  // Manually set headers for formidable
  form.headers = {
    'content-type': req.headers.get('content-type'),
    'content-length': req.headers.get('content-length'),
  };

  console.log('Request:', req);
  console.log('Request Headers:', req.headers);
  console.log('Form Headers:', form.headers);
  console.log('Request files:', req.files);

  return new Promise((resolve, reject) => {
    form.parse(stream, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parsing error:', err);
        resolve(new Response(JSON.stringify({ error: 'Error parsing the files' }), { status: 500 }));
        return;
      }

      // Log the parsed files
      console.log('Parsed Files:', files);

      const filePromises = Object.values(files).map(async (file) => {
        try {
          const fileData = fs.readFileSync(file.filepath);
          const newFile = new File({
            filename: file.originalFilename,
            data: fileData,
            contentType: file.mimetype,
          });
          await newFile.save();
        } catch (error) {
          console.error('Error saving file to database:', error);
          throw error;
        }
      });

      try {
        await Promise.all(filePromises);
        resolve(new Response(JSON.stringify({ message: 'Files uploaded successfully' }), { status: 200 }));
      } catch (error) {
        console.error('Error in file upload process:', error);
        resolve(new Response(JSON.stringify({ error: 'Error saving files to database' }), { status: 500 }));
      }
    });
  });
}
