
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";

import { RegisterDto } from "../dto/auth/request/register.dto";
import { LoginDto } from "../dto/auth/request/login.dto";
import { IAuthService } from "../core/interfaces/services/IAuthService";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

   register=async(req: Request, res: Response): Promise<void>=> {
    try {
        console.log(req.body.data,"reqbody data");
        
      const registerDto = new RegisterDto(req.body.data);
    
      console.log(registerDto,"register dto");
      
      const { user, accessToken, refreshToken } = await this.authService.register(registerDto)

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" });

      res.status(201).json({ accessToken, user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

   login=async(req: Request, res: Response): Promise<void>=> {
    try {
      const loginDto = new LoginDto(req.body.data);

      const { user, accessToken, refreshToken } = await this.authService.login(loginDto);

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" });

      res.status(200).json({ accessToken, user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

   logout=async(req: Request, res: Response): Promise<void>=> {
    try {
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  refresh =async(req: Request, res: Response): Promise<void>=> {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log("refreshtoken",refreshToken);
      
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }
      const { accessToken, user } = await this.authService.refreshToken(refreshToken);
      res.status(200).json({ accessToken, user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
