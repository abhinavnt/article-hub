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

router.get("/", authMiddleware([UserRole.USER]), articleController.getAllArticles);
router.get("/preferences", authMiddleware([UserRole.USER]), articleController.getArticlesByPreferences);
router.put("/:id/like", authMiddleware([UserRole.USER]), articleController.likeArticle);
router.put("/:id/dislike", authMiddleware([UserRole.USER]), articleController.dislikeArticle);

router.get("/my", authMiddleware([UserRole.USER]), articleController.getMyArticles);
router.get("/my/stats", authMiddleware([UserRole.USER]), articleController.getMyArticleStats);
router.get("/:id", authMiddleware([UserRole.USER]), articleController.getArticleById);
router.put("/:id", authMiddleware([UserRole.USER]), upload.single("image"), articleController.updateArticle);
router.delete("/:id", authMiddleware([UserRole.USER]), articleController.deleteArticle);

export default router;
