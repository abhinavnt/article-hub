import { TYPES } from "../di/types";
import { Router } from "express";
import container from "../di/container";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";
import { upload } from "../config/multer";


const router = Router();
const userController = container.get<IUserController>(TYPES.UserController);

router.patch('/profile/:userId',authMiddleware([UserRole.USER]),userController.updateProfile)

router.patch('/preferences/:userId',authMiddleware([UserRole.USER]),userController.updatePreferences)

router.post('/profile-photo/:userId',authMiddleware([UserRole.USER]),upload.single('photo'),userController.updateProfilePhoto)

export default router;