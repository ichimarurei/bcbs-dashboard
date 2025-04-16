import connectDB from '@/lib/mongo';
import account, { IAccount } from '@/models/account';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function GET(_: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const accounts = await account.find().sort({ status: 'desc', name: 'asc' }).lean<IAccount[]>();
        response = Response.json(accounts, { status: 200 });
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
        let saved: IAccount | null = null;
        const params = await request.json();
        const id = params?.action === 'baru' ? uuid() : params?.action;

        if (!isEmpty(params?.name)) {
            saved = await account.findOneAndUpdate({ id }, { name: params?.name || `Anggota ${id}`, status: params?.status || false, number: params?.number || '', area: params?.area || '' }, { upsert: true, new: true, lean: true }).lean<IAccount>();
        }

        response = Response.json({ saved: !saved?._id ? false : true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message, saved: false }, { status: 500 });
    }

    return response;
}
