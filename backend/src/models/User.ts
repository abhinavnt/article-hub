import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  userId:string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: Date;
  articlePreferences: string[];
  role: "user" | "admin";
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId:{type:String,required:true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImageUrl: { type: String, required: false },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    articlePreferences: [{ type: String, required: true }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
