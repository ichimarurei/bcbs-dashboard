import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IBank extends Document {
    id: string;
    bank: string;
    account: string;
    number: string;
    amount: number;
    proof?: string;
}

const BankSchema: Schema = new Schema({
    id: { type: String, unique: true, required: true, default: uuid() },
    bank: { type: String, unique: true, required: true },
    account: { type: String },
    number: { type: String },
    amount: { type: Number },
    proof: { type: String, required: false, default: '' }
});

export default mongoose.models.Bank || mongoose.model<IBank>('Bank', BankSchema);
