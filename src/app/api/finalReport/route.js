import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { initGridFS,uploadFinalReport,findFinalReport, downloadFinalReport } from "@/model/FinalReport";
import { formidable } from "formidable";
import { Readable } from 'stream';

// Disable bodyParser for formidable (Next.js special config for file upload)
export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export async function POST(req) {
    try {
      const db = await dbConnect();
      await initGridFS(db);
  
      const form = new formidable.IncomingForm();
      console.log('object',form);
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
        }
  
        const incidentNo = fields.incidentNo;
        const file = files.file;
  
        // Upload the file to GridFS
        const fileData = {
          originalname: file.originalFilename,
          buffer: Readable.from(file.filepath), // Convert to readable stream
        };
  
        await uploadFinalReport(db, fileData, incidentNo);
  
        return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
      });
    } catch (error) {
      return NextResponse.json({ message: 'Something went wrong while uploading' }, { status: 500 });
    }
  }
  
  export async function GET(req) {
    try {
      const db = await dbConnect();
      await initGridFS(db);
  
      const { searchParams } = new URL(req.url);
      const incidentNo = searchParams.get('incidentNo');
  
      if (!incidentNo) {
        return NextResponse.json({ message: 'Incident number not provided' }, { status: 400 });
      }
  
      // Find the file by incident number
      const report = await findFinalReport(db, incidentNo);
      if (report.length === 0) {
        return NextResponse.json({ message: 'No report found for the incident' }, { status: 404 });
      }
  
      const downloadStream = downloadFinalReport(db, report[0]._id);
      const stream = new Readable();
  
      downloadStream.on('data', (chunk) => stream.push(chunk));
      downloadStream.on('end', () => stream.push(null));
      downloadStream.on('error', (err) => {
        return NextResponse.json({ message: 'Error while fetching file' }, { status: 500 });
      });
  
      return new Response(stream, {
        headers: {
          'Content-Disposition': `attachment; filename=${report[0].filename}`,
          'Content-Type': 'application/octet-stream',
        },
      });
    } catch (error) {
      return NextResponse.json({ message: 'Something went wrong while fetching' }, { status: 500 });
    }
  }