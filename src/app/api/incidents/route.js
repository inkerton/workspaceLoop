import dbConnect from '../../../utils/mongodb';
import NewIncident from "../../../model/NewIncident";
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function  GET(request){
    // const { id } = request.query;
    const { searchParams } = new URL(request.url);
    const incidentNo = searchParams.get('incidentNo');
    console.log('inc',incidentNo);
    await dbConnect();
  try {
    const incident = await NewIncident.findOne({ incidentNo });
    console.log(incident);

    if (!incident) {
      return NextResponse.json({message: "No incident present"}, {status: 500});  
    } 

    return NextResponse.json({data: incident}, {status: 200});
  } catch(error) {
    console.log(error)
    return NextResponse.json({message: "Error while fetching incident"}, {status: 500});
  }

 }