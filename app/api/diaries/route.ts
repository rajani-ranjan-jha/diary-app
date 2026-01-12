import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Diary from '@/models/Diary';

export async function GET() {
    await dbConnect();
    try {
        const diaries = await Diary.find({}).sort({ date_modified: -1 });
        return NextResponse.json({ success: true, data: diaries });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch diaries' }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const body = await request.json();
        console.log("creating new diary: ", body)
        const diary = await Diary.create(body);
        return NextResponse.json({ success: true, data: diary }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create diary' }, { status: 400 });
    }
}
