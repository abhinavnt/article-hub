import { Request, Response } from "express";

export interface IUserController {
 updateProfile(req: Request, res: Response): Promise<void>;
  updatePreferences(req: Request, res: Response): Promise<void>;
  updateProfilePhoto(req: Request, res: Response): Promise<void>;
}