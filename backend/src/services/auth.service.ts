
import { TYPES } from "../di/types";

import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { RegisterDto } from "../dto/auth/request/register.dto";
import { UserResponseDto } from "../dto/auth/response/user-response.dto";
import { LoginDto } from "../dto/auth/request/login.dto";
import { generateToken } from "../utils/token.utils";
import { comparePassword, hashPassword } from "../utils/bycrpt.util";

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

 async register(data: RegisterDto): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string; }> {
      console.log("reached the service layer",data);
    
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const existingPhone = await this.userRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new Error("Phone already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    const userId = uuidv4(); // Generates a unique userId

    const newUser = await this.userRepository.create({
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      dateOfBirth: new Date(data.dateOfBirth),
      password: hashedPassword,
      articlePreferences: data.articlePreferences,
    });

    const accessToken = generateToken({ userId: newUser.userId }, process.env.JWT_SECRET || "secret", "15m");

    const refreshToken = generateToken({ userId: newUser.userId }, process.env.JWT_REFRESH_SECRET || "refresh_secret", "7d");

    return { user: new UserResponseDto(newUser), accessToken, refreshToken };
 }

  async login(data: LoginDto): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
    const user = (await this.userRepository.findByEmail(data.identifier)) || (await this.userRepository.findByPhone(data.identifier));

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const accessToken = generateToken({ userId: user.userId }, process.env.JWT_SECRET || "secret", "15m");
    const refreshToken = generateToken({ userId: user.userId }, process.env.JWT_REFRESH_SECRET || "refresh_secret", "7d");

    return { user: new UserResponseDto(user), accessToken, refreshToken };
  }

  async getUserByIdentifier(identifier: string): Promise<UserResponseDto> {
    const user = (await this.userRepository.findByEmail(identifier)) || (await this.userRepository.findByPhone(identifier));
    if (!user) {
      throw new Error("User not found");
    }
    return new UserResponseDto(user);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; user: UserResponseDto }> {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret") as { userId: string };

    const user = await this.userRepository.findByUserId(decoded.userId);

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateToken({ userId: user.userId }, process.env.JWT_SECRET || "secret", "15m");

    return { accessToken: newAccessToken, user: new UserResponseDto(user) };
  }
}
