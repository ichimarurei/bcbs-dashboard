import connectDB from '@/lib/mongo';
import admin, { IAdmin } from '@/models/admin';
import cash, { ICash } from '@/models/cash';
import dayjs from 'dayjs';
import dayjsUTC from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';

dayjs.extend(dayjsUTC);

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string; account: string }> }) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const { slug, account } = await params;
        const cashes = await cash.find({ account, category: slug }).sort({ created: 'desc' }).lean<ICash[]>();
        response = Response.json(cashes, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string; account: string }> }) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        let saved: ICash | null = null;
        const payload = await request.json();
        const { slug, account } = await params;
        const id = payload?.action === 'baru' ? uuid() : payload?.action;
        const flagAsDelete = payload?.removal ?? false;

        if (!isEmpty(payload?.type) && payload?.amount > 0) {
            let operator: IAdmin | null = null;

            if (!isEmpty(payload?.operator)) {
                operator = await admin.findOne({ phone: payload.operator }).lean<IAdmin>();
            }

            if (!flagAsDelete) {
                saved = await cash
                    .findOneAndUpdate(
                        { id },
                        {
                            account,
                            category: slug,
                            type: payload.type,
                            amount: payload.amount,
                            operator: operator?.id || 'system',
                            date: payload?.date || dayjs().format('DD-MM-YYYY'),
                            ...(payload?.action === 'baru' ? { created: dayjs().utc().toDate() } : { updated: dayjs().utc().toDate() })
                        },
                        { new: true, lean: true, upsert: true }
                    )
                    .lean<ICash>();
            } else {
                saved = await cash.findOneAndDelete({ id }, { lean: true }).lean<ICash>();
            }

            response = Response.json({ saved: !saved?._id ? false : true }, { status: 200 });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message, saved: false }, { status: 500 });
    }

    return response;
}
