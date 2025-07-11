import { inject, injectable } from "inversify";
import { IArticleController } from "../core/interfaces/controllers/IArticleController";
import { IArticleService } from "../core/interfaces/services/IArticleService";
import { TYPES } from "../di/types";
import { Request, Response } from "express";
import { ArticleUpdateDto } from "../dto/article/response/article-response.dto";

@injectable()
export class ArticleController implements IArticleController {
  constructor(@inject(TYPES.ArticleService) private articleService: IArticleService) {}

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.articleService.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "Category name is required" });
        return;
      }
      const category = await this.articleService.createCategory(name);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  private async handleArticleCreation(req: Request, res: Response, status: "draft" | "published"): Promise<void> {
    try {
      //   const userId = req.params.userId;
      const userId = req.user?._id as string;
      console.log("userid from handleArticleCreation", userId);

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { title, description, content, tags, category } = req.body;
      const imageFile = req.file;

      const data = {
        title,
        description,
        content,
        tags: tags ? JSON.parse(tags) : [],
        categoryName: category,
      };

      let article;
      if (status === "draft") {
        article = await this.articleService.saveDraft(data, userId, imageFile);
      } else {
        article = await this.articleService.publishArticle(data, userId, imageFile);
      }

      res.status(201).json({ id: article.id, title: article.title });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  saveDraft = async (req: Request, res: Response): Promise<void> => {
    await this.handleArticleCreation(req, res, "draft");
  };

  publishArticle = async (req: Request, res: Response): Promise<void> => {
    await this.handleArticleCreation(req, res, "published");
  };

  getAllArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 9;
      const articles = await this.articleService.getAllArticles(userId, page, pageSize);
      res.json(articles);
    } catch (error: any) {
      console.log(error.stack);

      res.status(500).json({ message: error.message });
    }
  };

  getArticlesByPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 9;
      const articles = await this.articleService.getArticlesByPreferences(userId, page, pageSize);
      res.json(articles);
    } catch (error: any) {
      console.log(error);

      res.status(500).json({ message: error.message });
    }
  };

  likeArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const articleId = req.params.id;
      await this.articleService.likeArticle(articleId, userId);
      res.status(200).json({ message: "Article liked" });
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  };

  dislikeArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const articleId = req.params.id;
      await this.articleService.dislikeArticle(articleId, userId);
      res.status(200).json({ message: "Article disliked" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  blockArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const articleId = req.params.id;
      await this.articleService.blockArticle(articleId, userId);
      res.status(200).json({ message: "Article blocked" });
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  };

  getMyArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const articles = await this.articleService.getUserArticles(userId);
      res.json(articles);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getMyArticleStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const stats = await this.articleService.getUserArticleStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const articleId = req.params.id;
      const article = await this.articleService.getArticleById(articleId);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(article);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  updateArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const articleId = req.params.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { title, description, content, tags, category, status } = req.body;
      const imageFile = req.file;

      const data = {
        title,
        description,
        content,
        tags: tags ? JSON.parse(tags) : [],
        categoryName: category,
        status,
      };

      const updatedArticle = await this.articleService.updateArticle(articleId, data, userId, imageFile);
      res.json(updatedArticle);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };

  deleteArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id as string;
      const articleId = req.params.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      await this.articleService.deleteArticle(articleId, userId);
      res.status(204).send();
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
}
