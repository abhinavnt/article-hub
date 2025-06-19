import { BaseRepository } from "../core/abstracts/base.repository";
import { IArticleRepository } from "../core/interfaces/repositories/IArticleRepository";
import { Article, IArticle } from "../models/Article";




export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository{
    constructor(){
        super(Article)
    }

    async createArticle(data: Partial<IArticle>): Promise<IArticle> {
        return this.model.create(data)
    }
}