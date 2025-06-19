import { Document, Schema, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Category = model<ICategory>('Category', categorySchema);