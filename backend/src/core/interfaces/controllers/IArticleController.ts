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
  blockArticle(req: Request, res: Response): Promise<void>

  getMyArticles(req: Request, res: Response): Promise<void>
  getMyArticleStats(req: Request, res: Response): Promise<void>
  getArticleById(req: Request, res: Response): Promise<void>
  updateArticle(req: Request, res: Response): Promise<void>
  deleteArticle(req: Request, res: Response): Promise<void>
}