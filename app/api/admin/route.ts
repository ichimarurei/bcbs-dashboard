import connectDB from '@/lib/mongo';
import admin, { IAdmin } from '@/models/admin';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const admins = await admin.find().lean<IAdmin[]>();
        response = Response.json(admins, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
