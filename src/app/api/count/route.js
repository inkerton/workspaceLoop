import dbConnect from "@/utils/mongodb";
import NewIncident from "@/model/NewIncident";
import { NextResponse } from "next/server";
import BinIncident from "@/model/Bin";

export async function GET(request){
    console.log('inside count request')
    await dbConnect();
    try {
        const numOfIncidents = await NewIncident.countDocuments();
        const numOfBins = await BinIncident.countDocuments();

        const count = numOfBins + numOfIncidents;

        return NextResponse.json({count: count}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "No incident present"}, {status: 500});
    }
}
