import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ICategoryRepository } from "../core/interfaces/repositories/ICategoryRepository";
import { Category, ICategory } from "../models/Category";


@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
    constructor(){
        super(Category)
    }

    async findAll(): Promise<ICategory[]> {
        return this.model.find({})
    }

    async findByName(name: string): Promise<ICategory | null> {
        return this.model.findOne({name})
    }

    async createCategory(data: Partial<ICategory>): Promise<ICategory> {
        return this.model.create(data)
    }

}