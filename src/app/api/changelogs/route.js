import ChangeLog from "@/model/ChangeLogs";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET(request){
    dbConnect();
    try {
        const data = await ChangeLog.find();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error while fetching bins"}, {status: 500});
    }
}