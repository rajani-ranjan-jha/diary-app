import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Diary from '@/models/Diary';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(request: NextRequest, props: Props) {
    const params = await props.params;
    await dbConnect();
    try {
        const diary = await Diary.findById(params.id);
        if (!diary) {
            return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: diary });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch diary' }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, props: Props) {
    const params = await props.params;
    await dbConnect();
    try {
        const body = await request.json();
        body.date_modified = Date.now();

        const diary = await Diary.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!diary) {
            return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: diary });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update diary' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, props: Props) {
    const params = await props.params;
    await dbConnect();
    try {
        const titles = await Diary.deleteOne({ _id: params.id });
        if (!titles) {
            return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete diary' }, { status: 400 });
    }
}
