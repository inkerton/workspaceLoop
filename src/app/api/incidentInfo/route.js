import multer from "multer";
import dbConnect from "../../../utils/mongodb";
import IncidentInfo from "@/model/Incident";
import { NextResponse } from "next/server";
import ChangeLog from "@/model/ChangeLogs";


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
          return NextResponse.json(
            { message: "Error processing files" },
            { status: 500 }
          );
        } else {
          resolve();
        }
      });
    });

    // Access uploaded files and form data
    const allpdf = req.files || [];

    const formData = await req.formData();

    const username = formData.get("username");
    const timeOfAction = formData.get("timeOfAction");
    const TTP = formData.get("TTPDetails");
    const TTPDetails = JSON.parse(TTP);
    const incidentNo = formData.get("incidentNo");
    const entryPointOfContactName = formData.get("entryPointOfContactName");
    const entryPointOfContactNumber = formData.get("entryPointOfContactNumber");
    const artifacts = formData.get("artifacts");
    const miscellaneousInfo = formData.get("miscellaneousInfo");
    console.log("Uploaded files:", req.files);
    const logCollectionDetails = formData.get("logCollectionDetails");
    console.log("log collection detals: ", logCollectionDetails);


    // Create new IncidentInfo document
    const newInfo = new IncidentInfo({
      incidentNo,
      entryPointOfContactName,
      entryPointOfContactNumber,
      logCollectionDetails,
      artifacts,
      miscellaneousInfo,
      TTPDetails: TTPDetails,
    });

    await newInfo.save();

    const changeLog = new ChangeLog({
      username,
      action: `Added incident info of ${incidentNo}`,
      timeOfAction,
      incidentNo: incidentNo,
    });

    await changeLog.save();

    return NextResponse.json(
      { message: "Incident created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating incident:", error);
    return NextResponse.json(
      { message: "Error creating incident" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const incidentNo = searchParams.get("incidentNo");
  await dbConnect();
  try {
    const incidentInfo = await IncidentInfo.findOne({ incidentNo });

    if (!incidentInfo) {
      return NextResponse.json(
        { message: "No incident present" },
        { status: 404 }
      );
    }

    return NextResponse.json(incidentInfo, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error while fetching incident" },
      { status: 500 }
    );
  }
}
