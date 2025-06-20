import { Schema, model, Document, Types } from "mongoose";

export interface IArticle extends Document {
  userId: string;
  categoryId: Types.ObjectId;
  categoryName:String;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  status: 'draft' | 'published';
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  blockedUsers:  Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  userId: { type: String, ref: "User", required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  categoryName:{type:String,required:true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  dislikes:[{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Article = model<IArticle>("Article", ArticleSchema);