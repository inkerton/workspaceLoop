

import dbConnect from '@/utils/mongodb';
import NewIncident from '@/model/NewIncident';
import IncidentInfo from '@/model/Incident';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { searchValue } = await request.json();
    console.log('Search values:', searchValue);

    // Convert searchValue to an array of keywords
    const keywords = searchValue.map(keyword => keyword.trim()).filter(keyword => keyword);

    // Search in NewIncident schema
    const newIncidentQueries = keywords.map(keyword => ({
      $or: [
        { incidentNo: { $regex: keyword, $options: 'i' } },
        { inputSource: { $regex: keyword, $options: 'i' } },
        { entityImpacted: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { brief: { $regex: keyword, $options: 'i' } },
        { assignedTo: { $regex: keyword, $options: 'i' } },
        { status: { $regex: keyword, $options: 'i' } },
        { comment: { $regex: keyword, $options: 'i' } },
      ],
    }));

    const newIncidentResults = await NewIncident.find({
      $or: newIncidentQueries,
    }).lean();

    // Extract unique incidentNos from NewIncident results
    const newIncidentNumbers = Array.from(
      new Set(newIncidentResults.map(incident => incident.incidentNo))
    );

    // Search in IncidentInfo schema using the incident numbers from NewIncident results
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
    }).select('incidentNo').lean();

    // Extract incident numbers from IncidentInfo results
    const incidentNumbers = Array.from(
      new Set(incidentInfoResults.map(incident => incident.incidentNo))
    );

    // Combine the incident numbers from both collections
    const combinedIncidentNumbers = Array.from(
      new Set([...newIncidentNumbers, ...incidentNumbers])
    );

    // Fetch all incidents from NewIncident using the combined incident numbers
    const allIncidents = await NewIncident.find({
      incidentNo: { $in: combinedIncidentNumbers }
    }).lean();

    // Remove duplicates by incidentNo
    const uniqueIncidents = Array.from(
      new Map(allIncidents.map(item => [item.incidentNo, item])).values()
    );

    console.log('Unique incidents:', uniqueIncidents);

    return NextResponse.json(uniqueIncidents, { status: 200 });
  } catch (error) {
    console.error('Error searching incidents:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
