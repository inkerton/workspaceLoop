import dbConnect from '@/utils/mongodb';
import NewIncident from '@/model/NewIncident';
import IncidentInfo from '@/model/Incident'; // Import the Incident model
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { searchValue } = await request.json();
    console.log('Search values:', searchValue);

    // Convert searchValue to an array of keywords
    const keywords = searchValue.map(keyword => keyword.trim()).filter(keyword => keyword);

    // Search in IncidentInfo schema
    const incidentInfoResults = await IncidentInfo.find({
      $or: [
        { incidentNo: { $regex: keywords.join('|'), $options: 'i' } },
        { entryPointOfContactName: { $regex: keywords.join('|'), $options: 'i' } },
        { entryPointOfContactNumber: { $regex: keywords.join('|'), $options: 'i' } },
        { logCollectionDetails: { $regex: keywords.join('|'), $options: 'i' } },
        { artifacts: { $regex: keywords.join('|'), $options: 'i' } },
        { miscellaneousInfo: { $regex: keywords.join('|'), $options: 'i' } },
        { TTPDetails: { $elemMatch: { value: { $regex: keywords.join('|'), $options: 'i' } } } }
      ]
    }).select('incidentNo'); // Only select the incidentNo field

    // Extract incident numbers from IncidentInfo results
    const incidentNumbers = incidentInfoResults.map(incident => incident.incidentNo);

    // Search in NewIncident schema using the incident numbers
    const newIncidentResults = await NewIncident.find({
      incidentNo: { $in: incidentNumbers }
    });

    // Remove duplicates by incidentNo
    const uniqueIncidents = Array.from(
      new Map(newIncidentResults.map(item => [item.incidentNo, item])).values()
    );

    console.log('Unique incidents:', uniqueIncidents);

    return NextResponse.json(uniqueIncidents, { status: 200 });
  } catch (error) {
    console.error('Error searching incidents:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
