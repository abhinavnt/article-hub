import { ICategory } from "../../../models/Category";

export interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  findByName(name: string): Promise<ICategory | null>;
  createCategory(data: Partial<ICategory>): Promise<ICategory>;
}