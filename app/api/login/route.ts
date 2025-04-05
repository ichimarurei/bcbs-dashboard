import connectDB from '@/lib/mongo';
import admin from '@/models/admin';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });
    let signed = false;
    await connectDB();

    try {
        const { phone, password } = await req.json();
        const exist = await admin.findOne({ phone }).lean();

        if (exist) {
            signed = true;
        }

        response = Response.json(signed ? exist : { error: 'Akun tidak ditemukan' }, { status: signed ? 200 : 404 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
