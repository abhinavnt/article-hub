import { ArticleFeedDto } from "../../../dto/article/response/article-feed.dto";
import { ArticleResponseDto, ArticleStatsDto, ArticleUpdateDto } from "../../../dto/article/response/article-response.dto";
import { CategoryResponseDto } from "../../../dto/article/response/category-response.dto";
import { IArticle } from "../../../models/Article";

export interface IArticleService {
  getCategories(): Promise<CategoryResponseDto[]>;
  createCategory(name: string): Promise<CategoryResponseDto>;
  saveDraft(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto>;
  publishArticle(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto>;

  getAllArticles(userId: string, page: number, pageSize: number): Promise<ArticleFeedDto[]>;
  getArticlesByPreferences(userId: string, page: number, pageSize: number): Promise<ArticleFeedDto[]>;
  likeArticle(articleId: string, userId: string): Promise<void>;
  dislikeArticle(articleId: string, userId: string): Promise<void>;
  blockArticle(articleId: string, userId: string): Promise<IArticle|null>

  getUserArticles(userId: string): Promise<ArticleResponseDto[]>;
  getUserArticleStats(userId: string): Promise<ArticleStatsDto>;
  getArticleById(id: string): Promise<ArticleResponseDto | null>;
  updateArticle(id: string, data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto>;
  deleteArticle(id: string, userId: string): Promise<void>;
}
