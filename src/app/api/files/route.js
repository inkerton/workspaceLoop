import File from "@/model/File";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    dbConnect();
    try {
        console.log('object inside try');
        const formData = await request.formData();
        const incidentNo = formData.get('incidentNo');
        const file = formData.get('file');
        console.log('incidentNo', incidentNo);
        console.log('file', file);
        

        if (!file || !incidentNo) {
            return NextResponse.json({ message: "Missing incident number or file." }, { status: 400 });
        }

        const newFile = new File({
            incidentNo: incidentNo,
            filename: file.name,
            fileData: Buffer.from(await file.arrayBuffer()),
            contentType: file.type,
        });

        await newFile.save();

        return NextResponse.json({message: "File received"},{status: 200});
    } catch (error) {
        return NextResponse.json({message: "Error while storing file"}, {status: 500});
    }
}

export async function GET(request) {
    await dbConnect();

    const url = new URL(request.url);
    const incidentNo = url.searchParams.get('incidentNo');

    if (!incidentNo) {
        return NextResponse.json({ message: "Incident number is required." }, { status: 400 });
    }

    try {
        const files = await File.find({ incidentNo: incidentNo });

        if (!files || files.length === 0) {
            return NextResponse.json({ message: "No files found for this incident." }, { status: 404 });
        }

        return NextResponse.json(files.map(file => ({
            id: file._id,
            filename: file.filename,
            contentType: file.contentType,
            uploadDate: file.uploadDate,
        })), { status: 200 });
    } catch (error) {
        console.error("Error fetching files:", error);
        return NextResponse.json({ message: "Failed to fetch files." }, { status: 500 });
    }
}