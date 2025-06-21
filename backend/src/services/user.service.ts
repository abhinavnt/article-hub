import { inject, injectable } from "inversify";
import { IUserService } from "../core/interfaces/services/IUserService";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { UserResponseDto } from "../dto/auth/response/user-response.dto";
import { IUser } from "../models/User";
import { UpdatePreferencesDto } from "../dto/auth/response/update-preference.dto";
import cloudinary from "../config/cloudinary";

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async updateProfile(userId: string, data: UserResponseDto): Promise<UserResponseDto> {
    const user = await this.userRepository.updateUser(userId, data);
    if (!user) {
      throw new Error("user not found");
    }
    return new UserResponseDto(user);
  }

  async updatePreferences(userId: string, data: UpdatePreferencesDto): Promise<UserResponseDto> {

    const user = await this.userRepository.updateUser(userId, data);
    if (!user) {
      throw new Error("user not found");
    }
    return new UserResponseDto(user);
  }

  async updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<UserResponseDto> {
    

    // Validate file
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    // Upload to Cloudinary using buffer directly
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_photos",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Pipe the buffer to Cloudinary
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });


    const imageUrl = result.secure_url;

    // Update user in repository
    const user = await this.userRepository.updateUser(userId, { profileImageUrl: imageUrl });

    if (!user) {
      throw new Error("user not found");
    }

    return new UserResponseDto(user);
  }
}
