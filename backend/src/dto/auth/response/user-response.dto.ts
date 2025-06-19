import { IUser } from "../../../models/User";

export class UserResponseDto {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  articlePreferences: string[];
  role: "user" | "admin";
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
  profileImageUrl?:string

  constructor(user: IUser) {
    this.userId = user.userId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.dateOfBirth = user.dateOfBirth;
    this.articlePreferences = user.articlePreferences;
    this.role = user.role;
    this.profileImageUrl=user.profileImageUrl;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}