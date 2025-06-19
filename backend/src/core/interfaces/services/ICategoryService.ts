import { ICategory } from "../../../models/Category";

export interface ICategoryService {
  getAllCategories(): Promise<ICategory[]>;
  createCategory(name: string): Promise<ICategory>;
}