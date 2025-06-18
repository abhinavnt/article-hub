import { LoginDto } from "../../../dto/auth/request/login.dto";
import { RegisterDto } from "../../../dto/auth/request/register.dto";
import { UserResponseDto } from "../../../dto/auth/response/user-response.dto";


export interface IAuthService {
  register(data: RegisterDto): Promise<{ user: UserResponseDto, accessToken: string, refreshToken: string }>;
  login(data: LoginDto): Promise<{ user: UserResponseDto, accessToken: string, refreshToken: string }>;
  getUserByIdentifier(identifier: string): Promise<UserResponseDto>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string, user: UserResponseDto }>;
}