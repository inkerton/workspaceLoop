import dbConnect from "@/utils/mongodb";
import NewIncident from "@/model/NewIncident";
import { NextResponse } from "next/server";

export async function GET(request){
    console.log('inside count request')
    await dbConnect();
    try {
        const numOfIncidents = await NewIncident.countDocuments();
        console.log(numOfIncidents);

        return NextResponse.json({count: numOfIncidents}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "No incident present"}, {status: 500});
    }
}
