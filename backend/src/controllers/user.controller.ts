import { inject, injectable } from "inversify";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { TYPES } from "../di/types";
import { IUserService } from "../core/interfaces/services/IUserService";
import { Request, Response } from "express";
import { UpdateProfileDto } from "../dto/auth/request/update-profile.dto";
import { UpdatePreferencesDto } from "../dto/auth/response/update-preference.dto";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId

      const data: UpdateProfileDto = req.body;

      const updatedUser = await this.userService.updateProfile(userId, data);

      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updatePreferences = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("reached the controller");
        
      const userId = req.params.userId

      const data: UpdatePreferencesDto = req.body;
  
      const updatedUser = await this.userService.updatePreferences(userId, data);

      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateProfilePhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("reached controller updateProfilePhoto");
        
      const userId = req.params.userId

      const file = req.file;

      if (!file) throw new Error("No file uploaded");

      const user = await this.userService.updateProfilePhoto(userId, file);

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
