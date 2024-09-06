// api/files/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import File from '@/model/File';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const incidentNo = searchParams.get('incidentNo');

        if (!incidentNo) {
            return NextResponse.json({ message: 'Incident number is required' }, { status: 400 });
        }

        const files = await File.find({ incidentNo });
        if (!files) {
            return NextResponse.json({ message: 'No files found' }, { status: 404 });
        }

        return NextResponse.json(files, { status: 200 });
    } catch (error) {
        console.error('Error fetching files:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
