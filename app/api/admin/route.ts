import { secretCrypto } from '@/lib/constant';
import connectDB from '@/lib/mongo';
import admin, { IAdmin } from '@/models/admin';
import { AES } from 'crypto-js';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';

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

export async function POST(request: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        let saved: IAdmin | null = null;
        const params = await request.json();
        const id = params?.action === 'baru' ? uuid() : params?.action;
        const password = AES.encrypt(params?.password || params?.phone || 'bismillah', secretCrypto).toString();
        const phone = params?.phone;

        if (phone && !isEmpty(params?.name)) {
            saved = await admin.findOneAndUpdate({ phone }, { name: params?.name || `Pengurus ${id}`, type: params?.type || 'admin', status: params?.status || false, phone, password }, { upsert: true, new: true, lean: true }).lean<IAdmin>();
        }

        response = Response.json({ saved: !saved?._id ? false : true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message, saved: false }, { status: 500 });
    }

    return response;
}
