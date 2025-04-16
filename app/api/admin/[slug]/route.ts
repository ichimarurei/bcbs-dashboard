import connectDB from '@/lib/mongo';
import admin, { IAdmin } from '@/models/admin';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const { slug } = await params;
        const user = await admin.findOne({ id: slug }).lean<IAdmin>();
        response = Response.json(user, { status: !user ? 404 : 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
