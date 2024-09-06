// pages/api/newincident/route.js
import dbConnect from '../../../utils/mongodb';
import NewIncident from "../../../model/NewIncident";
import { NextResponse } from 'next/server';
import ChangeLog from '@/model/ChangeLogs';

export async function POST(request){
  await dbConnect();
  const {incidentNo, inputSource, dateOfInput, entityImpacted, category, brief, assignedTo, status, comment, timeOfAction, username} = await request.json();
  console.log('status',status);

  try {
    const newincident = new NewIncident({incidentNo, inputSource, dateOfInput, entityImpacted, category, brief, assignedTo, status, comment});
    console.log('newww',newincident)
    await newincident.save();

    const changeLog = new ChangeLog({
      username,
      action: `New incident created ${incidentNo} `,
      timeOfAction,
      incidentNo: incidentNo,
  });

  await changeLog.save();

    
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
    const { incidentNo, status, incidentClosedOn, timeOfAction, username } = await request.json();

    const incident = await NewIncident.findOne({ incidentNo });

    if (!incident) {
      return NextResponse.json({ message: "Incident not found" }, { status: 404 });
    }

    // incident.assignedTo = assignedTo;
    incident.status = status;
    incident.incidentClosedOn = incidentClosedOn;

    await incident.save();

    const changeLog = new ChangeLog({
      username,
      action: `Changed status of ${incidentNo} to ${status}`,
      timeOfAction,
      incidentNo: incidentNo,
  });

  await changeLog.save();

    // return NextResponse.json({ message: "Incident updated successfully", data: incident }, { status: 200 });
    return NextResponse.json({ message: "Incident updated successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error while updating incident" }, { status: 500 });
  }
}