import { Router } from "express";
import container from "../di/container";
import { TYPES } from "../di/types";
import { IArticleController } from "../core/interfaces/controllers/IArticleController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";
import { upload } from "../config/multer";

const router = Router();
const articleController = container.get<IArticleController>(TYPES.ArticleController);

router.get("/categories", articleController.getCategories);
router.post("/categories", authMiddleware([UserRole.USER]), articleController.createCategory);
router.post("/draft", authMiddleware([UserRole.USER]), upload.single("image"), articleController.saveDraft);
router.post("/publish", authMiddleware([UserRole.USER]), upload.single("image"), articleController.publishArticle);

export default router;