
import multer from "multer";
import dbConnect from "../../../utils/mongodb";
import IncidentInfo from "@/model/Incident";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser as we'll use Multer
  },
};

// const upload = multer().array("pdfFiles"); // Configure Multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("pdfFiles");

// export async function POST(req) {
//   await dbConnect();

//   // Handle potential errors during file upload
//   try {
//     await upload(req, null, async (err) => {
//       if (err) {
//         console.error("Error uploading files:", err);
//         // throw new Error("Error processing files");
//         return NextResponse.json(
//             { message: "Error processing files" },
//             { status: 500 }
//           );
//       }

//       // Access uploaded files and form data
//       const pdfFiles = req.files || [];

//       const formData = await req.formData();

//       const TTP = formData.get("TTPDetails");
//       const TTPDetails = JSON.parse(TTP);
//       console.log("ttp", TTPDetails);
//       const incidentNo = formData.get("incidentNo");
//       const entryPointOfContactName = formData.get("entryPointOfContactName");
//       const entryPointOfContactNumber = formData.get(
//         "entryPointOfContactNumber"
//       );
//       const artifacts = formData.get("artifacts");
//       const miscellaneousInfo = formData.get("miscellaneousInfo");

//       // Validate form data (implement your validation logic here)

//       // Prepare PDF data for storage (consider using a separate collection)
//       const pdfDataPromises = pdfFiles.map(async (file) => {
//         const buffer = await file.arrayBuffer();
//         console.log('chalk',file.arrayBuffer());
//         // Depending on your storage strategy, you might adjust the data format
//         return { filename: file.originalname, fileId: file._id, data: buffer }; // Example format
//       });

//       const pdfData = await Promise.all(pdfDataPromises);

//       // Create new IncidentInfo document
//       const newInfo = new IncidentInfo({
//         incidentNo,
//         entryPointOfContactName,
//         entryPointOfContactNumber,
//         artifacts,
//         miscellaneousInfo,
//         TTPDetails: TTPDetails,
//         // Store references to PDF data (adjust based on your storage approach)
//         pdfFiles: pdfData, // Use ID if storing in a separate collection
//       });

//       await newInfo.save();

//       return NextResponse.json(
//         { message: "Incident created successfully" },
//         { status: 201 }
//       );
//     });
//   } catch (error) {
//     console.error("Error creating incident:", error);
//     return NextResponse.json(
//         { message: "Error creating incident" },
//         { status: 500 }
//       );
//   }
// }

export async function POST(req) {
    await dbConnect();
  
    // Handle potential errors during file upload
    try {
      await new Promise((resolve, reject) => {
        upload(req, null, (err) => {
          if (err) {
            console.error("Error uploading files:", err);
            return (NextResponse.json(
              { message: "Error processing files" },
              { status: 500 }
            ));
          } else {
            resolve();
          }
        });
      });
  
      // Access uploaded files and form data
      const allpdf = req.files || [];
  
      const formData = await req.formData();
  
      const TTP = formData.get("TTPDetails");
      const TTPDetails = JSON.parse(TTP);
      const incidentNo = formData.get("incidentNo");
      const entryPointOfContactName = formData.get("entryPointOfContactName");
      const entryPointOfContactNumber = formData.get(
        "entryPointOfContactNumber"
      );
      const artifacts = formData.get("artifacts");
      const miscellaneousInfo = formData.get("miscellaneousInfo");
      console.log('Uploaded files:', req.files);

  
      // Prepare PDF data for storage
      const pdfData = allpdf.map(file => ({
        filename: file.originalname,
        data: file.buffer, // Store file buffer directly
      }));
  
      // Create new IncidentInfo document
      const newInfo = new IncidentInfo({
        incidentNo,
        entryPointOfContactName,
        entryPointOfContactNumber,
        artifacts,
        miscellaneousInfo,
        TTPDetails: TTPDetails,
        pdfFiles: pdfData, // Store buffers in MongoDB
      });
  
      await newInfo.save();
  
      return NextResponse.json(
        { message: "Incident created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating incident:", error);
      return NextResponse.json(
        { message: "Error creating incident" },
        { status: 500 }
      );
    }
  }
  


