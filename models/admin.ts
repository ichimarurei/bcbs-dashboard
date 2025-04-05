import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export interface IAdmin extends Document {
    id: string;
    phone: string;
    password: string;
    name: string;
    type: string;
    status: boolean;
}

const AdminSchema: Schema = new Schema({
    id: { type: String, unique: true, required: true, default: uuid() },
    phone: { type: String, unique: true, required: true },
    password: { type: String },
    name: { type: String },
    type: { type: String },
    status: { type: Boolean, default: false }
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
