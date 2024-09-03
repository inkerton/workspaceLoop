import dbConnect from "@/utils/mongodb";
import NewIncident from "@/model/NewIncident";
import BinIncident from "@/model/Bin";
import { NextResponse } from "next/server";
import ChangeLog from "@/model/ChangeLogs";

export async function POST(request){
    console.log('object restore')
    dbConnect();
    const body = await request.json();
    try {
        console.log('object inside try')
        const { incidentNo, username, restoredOn } = body;
        console.log('object no', incidentNo);
        console.log('object username', username);
        console.log('object timeOfAction', restoredOn);

        const binIncident = await BinIncident.findOne({ incidentNo });
        console.log(binIncident);

        if (!binIncident) {
            return NextResponse.json({ message: "Incident not found in bin" }, { status: 404 });
        }

        // Create a new NewIncident object with the incident data
        const newIncident = new NewIncident({
            ...binIncident._doc, // Spread all the properties from the found bin incident
        });

        await newIncident.save();
        await BinIncident.deleteOne({ incidentNo });

        const changeLog = new ChangeLog({
            username: username,
            action: `Restored ${incidentNo} from bin`,
            timeOfAction: restoredOn,
            incidentNo: incidentNo,
        });

        console.log('object change log', changeLog);
        await changeLog.save();

        return NextResponse.json({ message: "Incident restored from bin" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error while restoring incident" }, { status: 500 });
    }
}