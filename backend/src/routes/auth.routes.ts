
import { TYPES } from "../di/types";
import { Router } from "express";
import container from "../di/container";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";

const router = Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refresh);

export default router;
