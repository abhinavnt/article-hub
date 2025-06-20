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
import { ArticleFeedDto } from "../dto/article/response/article-feed.dto";

export interface ArticleInput {
  title: string;
  description: string;
  content: string;
  tags: string[];
  categoryName: string; // Name instead of ID
}

interface IUser {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export type PopulatedArticle = IArticle & { userId: IUser };

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
      categoryName: category.name,
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

  async getAllArticles(userId: string, page: number, pageSize: number): Promise<ArticleFeedDto[]> {
    const skip = (page - 1) * pageSize;
    const articles = await this.articleRepository.getAllArticles(userId, skip, pageSize);
    const dtos = articles.map((article) => this.mapToFeedDto(article, userId));
    dtos.sort((a, b) => {
      const aInteracted = a.userLiked || a.userDisliked;
      const bInteracted = b.userLiked || b.userDisliked;
      return aInteracted ? 1 : bInteracted ? -1 : 0;
    });
    return dtos;
  }

  async getArticlesByPreferences(userId: string, page: number, pageSize: number): Promise<ArticleFeedDto[]> {
    const skip = (page - 1) * pageSize;

    const articles = await this.articleRepository.getArticlesByPreferences(userId, skip, pageSize);

    const dtos = articles.map((article) => this.mapToFeedDto(article, userId));
    dtos.sort((a, b) => {
      const aInteracted = a.userLiked || a.userDisliked;
      const bInteracted = b.userLiked || b.userDisliked;
      return aInteracted ? 1 : bInteracted ? -1 : 0;
    });
    return dtos;
  }

  async likeArticle(articleId: string, userId: string): Promise<void> {
    await this.articleRepository.likeArticle(articleId, userId);
  }

  async dislikeArticle(articleId: string, userId: string): Promise<void> {
    await this.articleRepository.dislikeArticle(articleId, userId);
  }

  private mapToFeedDto(article: PopulatedArticle, userId: string): ArticleFeedDto {
    return {
      id: article._id ? article._id.toString() : "",
      title: article.title || "",
      description: article.description || "",
      content: article.content || "",
      imageUrl: article.imageUrl || "",
      tags: article.tags || [],
      status: article.status || "",
      categoryName: article.categoryName ? article.categoryName.toString() : "",
      authorName: article.userId ? `${article.userId.firstName || ""} ${article.userId.lastName || ""}`.trim() : "",
      authorAvatar: article.userId?.profileImageUrl || "",
      userLiked: article.likes ? article.likes.some((like) => like?.toString() === userId) : false,
      userDisliked: article.dislikes ? article.dislikes.some((dislike) => dislike?.toString() === userId) : false,
      likeCount: article.likes ? article.likes.length : 0,
      dislikeCount: article.dislikes ? article.dislikes.length : 0,
      blockCount: article.blockedUsers ? article.blockedUsers.length : 0,
      createdAt: article.createdAt || new Date(),
      updatedAt: article.updatedAt || new Date(),
    };
  }
}
