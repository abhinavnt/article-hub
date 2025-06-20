import { inject, injectable } from "inversify";
import { IArticleService } from "../core/interfaces/services/IArticleService";
import { TYPES } from "../di/types";
import { ICategoryRepository } from "../core/interfaces/repositories/ICategoryRepository";
import { IArticleRepository } from "../core/interfaces/repositories/IArticleRepository";
import { CategoryResponseDto } from "../dto/article/response/category-response.dto";
import cloudinary from "../config/cloudinary";
import { ArticleResponseDto } from "../dto/article/response/article-response.dto";
import { ObjectId, Types } from "mongoose";
import { IArticle } from "../models/Article";

export interface ArticleInput {
  title: string;
  description: string;
  content: string;
  tags: string[];
  categoryName: string; // Name instead of ID
}

@injectable()
export class ArticleService implements IArticleService {
  constructor(
    @inject(TYPES.CategoryRepository) private categoryRepository: ICategoryRepository,
    @inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository
  ) {}

  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((cat) => new CategoryResponseDto(cat));
  }

  async createCategory(name: string): Promise<CategoryResponseDto> {
    let category = await this.categoryRepository.findByName(name);
    if (!category) {
      category = await this.categoryRepository.createCategory({ name });
    }
    return new CategoryResponseDto(category);
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "article_images", resource_type: "image" }, (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      });
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  private async createArticle(
    data: ArticleInput,
    userId: string,
    status: "draft" | "published",
    imageFile?: Express.Multer.File
  ): Promise<ArticleResponseDto> {
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await this.uploadImage(imageFile);
    }

    let category = await this.categoryRepository.findByName(data.categoryName);
    if (!category) {
      category = await this.categoryRepository.createCategory({ name: data.categoryName });
    }

    if (!category) {
      throw new Error("category not found");
    }

    const articleData: Partial<IArticle> = {
      userId,
      categoryId: new Types.ObjectId(category._id as string), // category._id is Types.ObjectId
      categoryName:category.name,
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl,
      tags: data.tags,
      status,
    };

    const article = await this.articleRepository.createArticle(articleData);
    return new ArticleResponseDto(article);
  }

  async saveDraft(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto> {
    return this.createArticle(data, userId, "draft", imageFile);
  }

  async publishArticle(data: any, userId: string, imageFile?: Express.Multer.File): Promise<ArticleResponseDto> {
    return this.createArticle(data, userId, "published", imageFile);
  }
}
