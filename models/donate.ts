import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IDonate extends Document {
    id: string;
    operator: string;
    account?: string;
    date?: string;
    type: string;
    info: string;
    amount: number;
    created: Date;
    updated: Date;
}

const DonateSchema: Schema = new Schema({
    id: { type: String, unique: true, required: true, default: uuid() },
    operator: { type: String },
    account: { type: String, required: false, default: '' },
    date: { type: String, required: false, default: '' },
    type: { type: String },
    info: { type: String },
    amount: { type: Number },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

export default mongoose.models.Donate || mongoose.model<IDonate>('Donate', DonateSchema);
