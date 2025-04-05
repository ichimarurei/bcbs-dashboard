import connectDB from '@/lib/mongo';
import { IAdmin } from '@/models/admin';
import { IErrorResponse } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IAdmin[] | IAdmin | IErrorResponse>) {
    await connectDB();

    try {
        switch (req.method) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {}
}
