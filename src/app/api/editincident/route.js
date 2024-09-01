import dbConnect from "../../../utils/mongodb";
import NewIncident from "../../../model/NewIncident";
import { NextResponse } from "next/server";
import IncidentInfo from "@/model/Incident";
import ChangeLog from "@/model/ChangeLogs";

export async function PUT(request) {
  await dbConnect();
  try {
    console.log(request);
    if (!request.body) {
      console.log(request.body);
      return NextResponse.json(
        { message: "No data provided" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Destructure properties from the parsed JSON
    const {
      incidentNo,
      comment,
      assignedTo,
      inputSource,
      dateOfInput,
      entityImpacted,
      category,
      brief,
      entryPointOfContactName,
      entryPointOfContactNumber,
      logCollectionDetails,
      miscellaneousInfo,
      artifacts,
      TTPDetails,
      username,
      timeOfAction,
    } = body;
    console.log("ass", assignedTo);

    const incident = await NewIncident.findOne({ incidentNo });
    console.log("Incident:", incident);

    const info = await IncidentInfo.findOne({ incidentNo });
    console.log("Info:", info);

    if (!incident) {
      return NextResponse.json(
        { message: "Incident not found" },
        { status: 404 }
      );
    }

    incident.assignedTo = assignedTo;
    incident.comment = comment;
    incident.inputSource = inputSource;
    incident.dateOfInput = dateOfInput;
    incident.entityImpacted = entityImpacted;
    incident.category = category;
    incident.brief = brief;

    await incident.save();

    if (info) {
      if (
        entryPointOfContactName ||
        entryPointOfContactNumber ||
        miscellaneousInfo ||
        artifacts ||
        TTPDetails ||
        logCollectionDetails
      ) {
        if (entryPointOfContactName)
          info.entryPointOfContactName = entryPointOfContactName;
        if (entryPointOfContactNumber)
          info.entryPointOfContactNumber = entryPointOfContactNumber;
        if (logCollectionDetails)
          info.logCollectionDetails = logCollectionDetails;
        if (miscellaneousInfo) info.miscellaneousInfo = miscellaneousInfo;
        if (artifacts) info.artifacts = artifacts;
        if (TTPDetails) info.TTPDetails = TTPDetails;

        await info.save();
      }
    }

    const changeLog = new ChangeLog({
      username,
      action: `Edited incident:- ${incidentNo} `,
      timeOfAction,
    });

    await changeLog.save();

    // return NextResponse.json({ message: "Incident updated successfully", data: incident }, { status: 200 });
    return NextResponse.json(
      { message: "Incident updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error while updating incident" },
      { status: 500 }
    );
  }
}
