import { secretCrypto } from '@/lib/constant';
import connectDB from '@/lib/mongo';
import admin, { IAdmin } from '@/models/admin';
import { AES, enc } from 'crypto-js';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });
    let signed = false;

    try {
        await connectDB();
        const { phone, password } = await req.json();
        const exist = await admin.findOne({ phone }).lean<IAdmin>();

        if (exist) {
            signed = AES.decrypt(exist.password, secretCrypto).toString(enc.Utf8) === password;
        }

        response = Response.json(signed ? exist : { error: 'Akun tidak ditemukan' }, { status: signed ? 200 : 404 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
