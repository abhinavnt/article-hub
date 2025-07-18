
import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUser, User } from "../models/User";
import mongoose, { Mongoose } from "mongoose";


@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
      return this.model.create(data)
  }

  async findByEmail(email: string): Promise<IUser | null> {
      return this.model.findOne({email})
  }

  async findByPhone(phone: string): Promise<IUser | null> {
      return this.model.findOne({phone})
  }

  async findByUserId(userId: string): Promise<IUser | null> {
      return this.model.findOne({userId})
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    console.log("reached repository");
    
  return this.model.findOneAndUpdate({ userId },     
    data,
    { new: true } )
}


}
