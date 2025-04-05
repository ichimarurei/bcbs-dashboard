import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface ICash extends Document {
    id: string;
    account: string;
    operator: string;
    date: string;
    type: string;
    category: string;
    amount: number;
    created: Date;
    updated: Date;
}

const CashSchema: Schema = new Schema({
    id: { type: String, unique: true, required: true, default: uuid() },
    account: { type: String },
    operator: { type: String },
    date: { type: String },
    type: { type: String },
    category: { type: String },
    amount: { type: Number },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

export default mongoose.models.Cash || mongoose.model<ICash>('Cash', CashSchema);
