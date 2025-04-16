import connectDB from '@/lib/mongo';
import bank, { IBank } from '@/models/bank';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const banks = await bank.find().sort({ amount: 'desc', account: 'asc' }).lean<IBank[]>();
        response = Response.json(banks, { status: 200 });
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
        let saved: IBank | null = null;
        const params = await request.json();

        if (!isEmpty(params?.bank) && !isEmpty(params?.account) && !isEmpty(params?.action)) {
            saved = await bank
                .findOneAndUpdate({ id: params?.action }, { bank: params?.bank || '', account: params?.account || '', number: params?.number || '-', proof: params?.proof || '', amount: params?.amount || 0 }, { new: true, lean: true })
                .lean<IBank>();
        }

        response = Response.json({ saved: !saved?._id ? false : true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message, saved: false }, { status: 500 });
    }

    return response;
}
