import connectDB from '@/lib/mongo';
import cash, { ICash } from '@/models/cash';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const { slug } = await params;
        const cashFlow = await cash.findOne({ id: slug }).lean<ICash>();
        response = Response.json(cashFlow, { status: !cashFlow ? 404 : 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
