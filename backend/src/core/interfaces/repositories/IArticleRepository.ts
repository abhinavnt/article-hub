import { IArticle } from "../../../models/Article";
import { PopulatedArticle } from "../../../services/article.service";

export interface IArticleRepository {
  createArticle(data: Partial<IArticle>): Promise<IArticle>;
  getAllArticles(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]>
  getArticlesByPreferences(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]>
  likeArticle(articleId: string, userId: string): Promise<IArticle|null>
  dislikeArticle(articleId: string, userId: string): Promise<IArticle|null>
}