import dbConnect from "../../../utils/mongodb";
import NewIncident from "../../../model/NewIncident";
import IncidentInfo from "@/model/Incident";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const incidentNo = searchParams.get("incidentNo");
  console.log("inc", incidentNo);
  await dbConnect();
  try {
    const incident = await NewIncident.findOne({ incidentNo });
    const incidentInfo = await IncidentInfo.findOne({ incidentNo });

    if (!incident) {
      return NextResponse.json(
        { message: "No incident present" },
        { status: 500 }
      );
    }

    const responseData = { data: incident };

    if (incidentInfo) {
      responseData.additionalInfo = incidentInfo;
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error while fetching incident" },
      { status: 500 }
    );
  }
}
