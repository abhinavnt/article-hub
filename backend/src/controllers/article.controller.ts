import { inject, injectable } from "inversify";
import { IArticleController } from "../core/interfaces/controllers/IArticleController";
import { IArticleService } from "../core/interfaces/services/IArticleService";
import { TYPES } from "../di/types";
import { Request, Response } from "express";


@injectable()
export class ArticleController implements IArticleController{
     constructor(@inject(TYPES.ArticleService) private articleService: IArticleService) {}


     getCategories=async(req: Request, res: Response): Promise<void>=> {
         try {
      const categories = await this.articleService.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
     }

     createCategory=async(req: Request, res: Response): Promise<void>=> {
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
     }

     private async handleArticleCreation(req: Request, res: Response, status: "draft" | "published"): Promise<void> {
    try {
    //   const userId = req.params.userId;
    const userId = req.user?._id as string;
    console.log("userid from handleArticleCreation",userId);
    
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

     saveDraft=async(req: Request, res: Response): Promise<void>=> {
         await this.handleArticleCreation(req, res, "draft");
     }

     publishArticle=async(req: Request, res: Response): Promise<void>=> {
          await this.handleArticleCreation(req, res, "published");
     }

}