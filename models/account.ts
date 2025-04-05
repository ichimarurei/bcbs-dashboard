import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IAccount extends Document {
    id: string;
    name: string;
    number: string;
    area: string;
    status: boolean;
}

const AccountSchema: Schema = new Schema({
    id: { type: String, unique: true, required: true, default: uuid() },
    name: { type: String },
    number: { type: String },
    area: { type: String },
    status: { type: Boolean, default: false }
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
