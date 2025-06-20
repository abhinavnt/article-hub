import { IArticle } from "../../../models/Article";
import { ArticleStats } from "../../../repositories/article.repository";
import { PopulatedArticle } from "../../../services/article.service";

export interface IArticleRepository {
  createArticle(data: Partial<IArticle>): Promise<IArticle>;
  getAllArticles(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]>
  getArticlesByPreferences(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]>
  likeArticle(articleId: string, userId: string): Promise<IArticle|null>
  dislikeArticle(articleId: string, userId: string): Promise<IArticle|null>
  getArticlesByUser(userId: string): Promise<PopulatedArticle[]>
  getUserArticleStats(userId: string): Promise<ArticleStats>
  getArticleById(id: string): Promise<IArticle | null>
  updateArticle(id: string, data: Partial<IArticle>): Promise<IArticle | null> 
  deleteArticle(id: string): Promise<void>
}