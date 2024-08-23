import dbConnect from "@/utils/mongodb";
import NewIncident from "@/model/NewIncident";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { searchValue } = await request.json();
    console.log(searchValue);

    //     const searchResults = await NewIncident.find({
    //       $or: [
    //         { incidentNo: { $regex: searchValue, $options: 'i' } }, 
    //          ...
    //       ]
    //     });


    const queries = searchValue.map((keyword) => ({
      $or: [
        { incidentNo: { $regex: keyword, $options: "i" } },
        { inputSource: { $regex: keyword, $options: "i" } },
        { entityImpacted: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { brief: { $regex: keyword, $options: "i" } },
        { assignedTo: { $regex: keyword, $options: "i" } },
        { status: { $regex: keyword, $options: "i" } },
        { comment: { $regex: keyword, $options: "i" } },
      ],
    }));

    // Combine the queries using $or
    const searchResults = await NewIncident.find({
      $or: queries,
    }).lean(); // Use lean() for better performance if you don't need full Mongoose documents

    // Remove duplicate incidents
    const uniqueResults = Array.from(
      new Set(searchResults.map((incident) => incident._id))
    ).map((id) => {
      return searchResults.find((incident) => incident._id === id);
    });

    console.log(uniqueResults);

    return NextResponse.json(uniqueResults, { status: 200 });
  } catch (error) {
    console.error("Error searching incidents:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
