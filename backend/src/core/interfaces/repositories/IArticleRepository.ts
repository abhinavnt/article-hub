import { IArticle } from "../../../models/Article";

export interface IArticleRepository {
  createArticle(data: Partial<IArticle>): Promise<IArticle>;
}