import { IUser } from "../../../models/User";


export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  findByUserId(userId: string): Promise<IUser | null>;
}