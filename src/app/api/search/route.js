import dbConnect from '@/utils/mongodb';
import NewIncident from '@/model/NewIncident';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { searchValue } = await request.json();
    console.log(searchValue)


    // const searchResults = await NewIncident.find({
    //     brief: { $regex: 'MITRE' }
    //   });
    //   console.log('Results for incidentNo:', searchResults);
      
    
    // Construct a search query to find incidents matching the keyword in relevant fields
    const searchResults = await NewIncident.find({
      $or: [
        { incidentNo: { $regex: searchValue, $options: 'i' } },
        { inputSource: { $regex: searchValue, $options: 'i' } },
        { entityImpacted: { $regex: searchValue, $options: 'i' } },
        { category: { $regex: searchValue, $options: 'i' } },
        { brief: { $regex: searchValue, $options: 'i' } },
        { assignedTo: { $regex: searchValue, $options: 'i' } },
        { status: { $regex: searchValue, $options: 'i' } },
        { comment: { $regex: searchValue, $options: 'i' } }
      ]
    });
    console.log(searchResults)

    return NextResponse.json(searchResults, { status: 200 });

  } catch (error) {
    console.error('Error searching incidents:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
