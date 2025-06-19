import { UpdateProfileDto } from "../../../dto/auth/request/update-profile.dto";
import { UpdatePreferencesDto } from "../../../dto/auth/response/update-preference.dto";
import { UserResponseDto } from "../../../dto/auth/response/user-response.dto";
import { IUser } from "../../../models/User";

export interface IUserService {
 updateProfile(userId: string, data: UpdateProfileDto): Promise<UserResponseDto>;
  updatePreferences(userId: string, data: UpdatePreferencesDto): Promise<UserResponseDto>;
 updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<UserResponseDto>;
}