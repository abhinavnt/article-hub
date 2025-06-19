import { ArticleResponseDto } from "../../../dto/article/response/article-response.dto";
import { CategoryResponseDto } from "../../../dto/article/response/category-response.dto";

export interface IArticleService {
  getCategories(): Promise<CategoryResponseDto[]>;
  createCategory(name: string): Promise<CategoryResponseDto>;
  saveDraft(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto>;
  publishArticle(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto>;
}