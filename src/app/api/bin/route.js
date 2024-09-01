import dbConnect from "@/utils/mongodb";
import NewIncident from "@/model/NewIncident";
import BinIncident from "@/model/Bin";
import { NextResponse } from "next/server";
import ChangeLog from "@/model/ChangeLogs";

export async function POST(request){
    console.log('object bin')
    dbConnect();
    const body = await request.json();

    try {
        const { incidentNo, deletedOn, deletedBy } = body;
        console.log('object no', incidentNo);
        console.log('object on', deletedOn);
        console.log('object by', deletedBy);
        console.log('object try')

        const incident = await NewIncident.findOne({ incidentNo });
        console.log(incident);

        if (!incident) {
            return NextResponse.json({ message: "Incident not found" }, { status: 404 });
          }

        // Create a new BinIncident object with the incident data
        const binIncident = new BinIncident({
            ...incident._doc, // Spread all the properties from the found incident
            deletedOn,        // Add the deletedOn field
            deletedBy         // Add the deletedBy field
        });

        await binIncident.save();
        
        await NewIncident.deleteOne({ incidentNo });

        const changeLog = new ChangeLog({
            username: deletedBy,
            action: `Moved ${incidentNo} to bin`,
            timeOfAction: deletedOn,
        });

        console.log('object change log', changeLog);
        await changeLog.save();

        return NextResponse.json({ message: "Incident moved to bin" }, { status: 200 });
      
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error while moving incident"}, {status: 500});
    }
}

export async function GET(request){
    dbConnect();
    try {
        const data = await BinIncident.find();
        const count = await BinIncident.countDocuments();
        return NextResponse.json({ data, count }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error while fetching bins"}, {status: 500});
    }
}