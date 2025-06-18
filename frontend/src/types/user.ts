export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  articlePreferences: string[];
  role: "user" | "admin";
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}


export interface UserUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  articlePreferences?: string[]
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}