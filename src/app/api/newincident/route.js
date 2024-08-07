// pages/api/newincident/route.js
import dbConnect from '../../../utils/mongodb';
import NewIncident from "../../../model/NewIncident";
import { NextResponse } from 'next/server';

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === 'POST') {
//     try {
//       const newincident = new NewIncident(req.body);
//       await newincident.save();
//       res.status(201).json({ success: true, data: newincident });
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else {
//     res.status(405).json({ success: false, error: 'Method not allowed' });
//   }
// }

export async function POST(request){
  await dbConnect();
  const {incidentNo, inputSource, dateOfInput, entityImpacted, category, brief, assignedTo, status, comment} = await request.json();
  console.log('status',status);

  try {
    const newincident = new NewIncident({incidentNo, inputSource, dateOfInput, entityImpacted, category, brief, assignedTo, status, comment});
    console.log('newww',newincident)
    await newincident.save();
    
    return NextResponse.json({message: "data stored successfully"},{status: 200});

  } catch (error) {
    console.error('Error saving new incident:', error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

export async function GET(request) {
  await dbConnect();
  try {
    const incidents = await NewIncident.find();

    if (!incidents) {
      return NextResponse.json({message: "No incidents present"}, {status: 500});  
    } 

    const numOfIncidents = await NewIncident.countDocuments();

    return NextResponse.json({data: incidents, count: numOfIncidents}, {status: 200});
  } catch(error) {
    console.log(error)
    return NextResponse.json({message: "Error while getting incidents"}, {status: 500});
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const { incidentNo, assignedTo, status } = await request.json();

    const incident = await NewIncident.findOne({ incidentNo });
    console.log(incident)

    if (!incident) {
      return NextResponse.json({ message: "Incident not found" }, { status: 404 });
    }

    incident.assignedTo = assignedTo;
    incident.status = status;

    await incident.save();

    // return NextResponse.json({ message: "Incident updated successfully", data: incident }, { status: 200 });
    return NextResponse.json({ message: "Incident updated successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error while updating incident" }, { status: 500 });
  }
}