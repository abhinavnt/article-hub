import { Schema, model, Document, Types } from "mongoose";

export interface IArticle extends Document {
  userId: string;
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  status: 'draft' | 'published';
  likeCount: number;
  dislikeCount: number;
  blockedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  userId: { type: String, ref: "User", required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], required: true },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  blockedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Article = model<IArticle>("Article", ArticleSchema);