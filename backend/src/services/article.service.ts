import { inject, injectable } from "inversify";
import { IArticleService } from "../core/interfaces/services/IArticleService";
import { TYPES } from "../di/types";
import { ICategoryRepository } from "../core/interfaces/repositories/ICategoryRepository";
import { IArticleRepository } from "../core/interfaces/repositories/IArticleRepository";
import { CategoryResponseDto } from "../dto/article/response/category-response.dto";
import cloudinary from "../config/cloudinary";
import { ArticleResponseDto, ArticleStatsDto, ArticleUpdateDto } from "../dto/article/response/article-response.dto";
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

export type PopulatedArticle = IArticle & { userInfo: IUser };

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
    console.log(articles, "articles from get all category");

    const dtos = articles.map((article) => this.mapToFeedDto(article, userId));
    console.log(dtos, "after maping the dto");

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
    console.log(userId, "userid from maping the dto", article, "article from the dto maping");

    return {
      id: article._id ? article._id.toString() : "",
      title: article.title || "",
      description: article.description || "",
      content: article.content || "",
      imageUrl: article.imageUrl || "",
      tags: article.tags || [],
      status: article.status || "",
      categoryName: article.categoryName ? article.categoryName.toString() : "",
      authorName: article.userInfo ? `${article.userInfo.firstName || ""} ${article.userInfo.lastName || ""}`.trim() : "",
      authorAvatar: article.userInfo?.profileImageUrl || "",
      userLiked: article.likes ? article.likes.some((like) => like?.toString() === userId) : false,
      userDisliked: article.dislikes ? article.dislikes.some((dislike) => dislike?.toString() === userId) : false,
      likeCount: article.likes ? article.likes.length : 0,
      dislikeCount: article.dislikes ? article.dislikes.length : 0,
      blockCount: article.blockedUsers ? article.blockedUsers.length : 0,
      createdAt: article.createdAt || new Date(),
      updatedAt: article.updatedAt || new Date(),
    };
  }

  async getUserArticles(userId: string): Promise<ArticleResponseDto[]> {
    const articles = await this.articleRepository.getArticlesByUser(userId);
    console.log(articles,"articles from service");
    
    return articles.map((article) => new ArticleResponseDto(article));
  }

  async getUserArticleStats(userId: string): Promise<ArticleStatsDto> {
    const stats = await this.articleRepository.getUserArticleStats(userId);
    return new ArticleStatsDto(stats);
  }

  async getArticleById(id: string): Promise<ArticleResponseDto | null> {
    const article = await this.articleRepository.getArticleById(id);
    return article ? new ArticleResponseDto(article) : null;
  }

  async updateArticle(
    id: string,
    data: any,
    userId: string,
    imageFile?: Express.Multer.File
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.getArticleById(id);
    if (!article) throw new Error("Article not found");
    if (article.userId !== userId) throw new Error("Unauthorized");

    let category = await this.categoryRepository.findByName(data.categoryName);
    if (!category) {
      category = await this.categoryRepository.createCategory({ name: data.categoryName });
    }

    let imageUrl = article.imageUrl;
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = uploadResult.secure_url;
    }

    const updateData: Partial<IArticle> = {
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl,
      tags: data.tags,
      categoryId: new Types.ObjectId(category._id as string),
      categoryName: category.name,
      status: data.status || article.status,
    };

    const updatedArticle = await this.articleRepository.updateArticle(id, updateData);
    if (!updatedArticle) throw new Error("Failed to update article");
    return new ArticleResponseDto(updatedArticle);
  }

  async deleteArticle(id: string, userId: string): Promise<void> {
    const article = await this.articleRepository.getArticleById(id);
    if (!article) throw new Error("Article not found");
    if (article.userId !== userId) throw new Error("Unauthorized");
    await this.articleRepository.deleteArticle(id);
  }
}
