import dbConnect from '../../../utils/mongodb';
import NewIncident from "../../../model/NewIncident";
import { NextResponse } from 'next/server';

export async function PUT(request) {
  await dbConnect();
  try {
    const { incidentNo, comment, assignedTo, inputSource, dateOfInput, entityImpacted, category, brief } = await request.json();

    const incident = await NewIncident.findOne({ incidentNo });
    console.log(incident)

    if (!incident) {
      return NextResponse.json({ message: "Incident not found" }, { status: 404 });
    }

    incident.assignedTo = assignedTo;
    incident.comment = comment;
    incident.inputSource = inputSource;
    incident.dateOfInput = dateOfInput;
    incident.entityImpacted = entityImpacted;
    incident.category = category;
    incident.brief = brief;

    await incident.save();

    // return NextResponse.json({ message: "Incident updated successfully", data: incident }, { status: 200 });
    return NextResponse.json({ message: "Incident updated successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error while updating incident" }, { status: 500 });
  }
}