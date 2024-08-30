import dbConnect from '../../../utils/mongodb';
import IncidentInfo from '@/model/Incident';
import { NextResponse } from 'next/server';
import BinIncident from '@/model/Bin';

export async function  GET(request){
    // const { id } = request.query;
    const { searchParams } = new URL(request.url);
    const incidentNo = searchParams.get('incidentNo');
    console.log('inc',incidentNo);
    await dbConnect();
  try {
    const incident = await BinIncident.findOne({ incidentNo });
    // console.log(incident);
    const incidentInfo = await IncidentInfo.findOne({ incidentNo });
    // console.log(incidentInfo);

    if (!incident) {
      return NextResponse.json({message: "No incident present"}, {status: 500});  
    } 
    
    // return NextResponse.json({data: incident}, {status: 200});
    const responseData = { data: incident };

        // If incidentInfo is present, include it in the response
        if (incidentInfo) {
            responseData.additionalInfo = incidentInfo;
        }

        return NextResponse.json(responseData, { status: 200 });
        
  } catch(error) {
    console.log(error)
    return NextResponse.json({message: "Error while fetching incident"}, {status: 500});
  }

 }
