import multer from 'multer';
import dbConnect from '../../../utils/mongodb';
import IncidentInfo from '@/model/Incident';
import { NextResponse } from 'next/server';


export const config = {
    api: {
        bodyParser: false,
    },
  };
  
  const uploadMiddleware = multer().array('pdfFiles');
  
  export async function POST(req) {
    await dbConnect();
  
    return new Promise((resolve, reject) => {
        uploadMiddleware(req, null, async (err) => {
            if (err) {
                return reject(NextResponse.json({ message: "Error processing files" }, { status: 500 }));
            }
  
            try {
                const { incidentNo, entryPointOfContactName, entryPointOfContactNumber, logCollectionDetails, artifacts, miscellaneousInfo, TTPDetails } = req.body;
                const pdfFiles = req.files || [];
  
                const pdfFileData = pdfFiles.map(file => ({
                    filename: file.filename,
                    fileId: file.id,
                }));
  
                const newInfo = new IncidentInfo({
                    incidentNo,
                    entryPointOfContactName,
                    entryPointOfContactNumber,
                    logCollectionDetails,
                    artifacts,
                    miscellaneousInfo,
                    TTPDetails: JSON.parse(TTPDetails),
                    pdfFiles: pdfFileData,
                });
  
                await newInfo.save();
  
                return resolve(NextResponse.json({ message: "Incident created successfully" }, { status: 201 }));
            } catch (error) {
                console.error('Error creating incident:', error);
                return reject(NextResponse.json({ message: "Error creating incident" }, { status: 500 }));
            }
        });
    });
  }