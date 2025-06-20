import { Request, Response } from "express";

export interface IArticleController {
  getCategories(req: Request, res: Response): Promise<void>;
  createCategory(req: Request, res: Response): Promise<void>;
  saveDraft(req: Request, res: Response): Promise<void>;
  publishArticle(req: Request, res: Response): Promise<void>;
  getAllArticles(req: Request, res: Response): Promise<void>
  getArticlesByPreferences(req: Request, res: Response): Promise<void>
  likeArticle(req: Request, res: Response): Promise<void>
  dislikeArticle(req: Request, res: Response): Promise<void>
}