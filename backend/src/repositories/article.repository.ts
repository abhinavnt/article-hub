import { BaseRepository } from "../core/abstracts/base.repository";
import { IArticleRepository } from "../core/interfaces/repositories/IArticleRepository";
import { Article, IArticle } from "../models/Article";
import { User } from "../models/User";
import { PopulatedArticle } from "../services/article.service";


export interface ArticleStats {
  totalArticles: number;
  totalLikes: number;
  totalViews: number;
  totalComments: number;
}

export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {
  constructor() {
    super(Article);
  }

  async createArticle(data: Partial<IArticle>): Promise<IArticle> {
    return this.model.create(data);
  }

  async getAllArticles(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]> {
    return this.model
      .aggregate([
        {
          $match: {
            status: "published",
            blockedUsers: { $nin: [userId] },
          },
        },
        {
          $lookup: {
            from: "users", // The name of the users collection
            localField: "userId", // Field in articles collection
            foreignField: "userId", // Field in users collection
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $project: {
            title: 1,
            content: 1,
            categoryName: 1,
            description: 1,
            tags: 1,
            status:1,
            likes: 1,
            dislikes: 1,
            blockedUsers: 1,
            imageUrl: 1,
            createdAt: 1,
            updatedAt: 1,
            // Include any other article fields you want to return
            "userInfo.firstName": 1,
            "userInfo.lastName": 1,
            "userInfo.profileImageUrl": 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  //change the user finding to service later
  async getArticlesByPreferences(userId: string, skip: number, limit: number): Promise<PopulatedArticle[]> {
    const user = await User.findOne({ userId });
    if (!user || !user.articlePreferences) {
      throw new Error("User or preferences not found");
    }
    return this.model
      .aggregate([
        {
          $match: {
            status: "published",
            categoryName: { $in: user.articlePreferences },
            blockedUsers: { $nin: [userId] },
          },
        },
        {
          $lookup: {
            from: "users", // Ensure this matches the actual collection name
            localField: "userId",
            foreignField: "userId",
            as: "userInfo",
          },
        },
        {
          $unwind: "$userInfo",
        },
        {
          $project: {
            title: 1,
            content: 1,
            categoryName: 1,
            description: 1,
            tags: 1,
            likes: 1,
            dislikes: 1,
            blockedUsers: 1,
            imageUrl: 1,
            createdAt: 1,
            updatedAt: 1,
            // Include any other article fields needed
            "userInfo.firstName": 1,
            "userInfo.lastName": 1,
            "userInfo.profileImageUrl": 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
  }

  async likeArticle(articleId: string, userId: string): Promise<IArticle | null> {
    return this.model.findByIdAndUpdate(articleId, { $addToSet: { likes: userId }, $pull: { dislikes: userId } }, { new: true }).exec();
  }

  async dislikeArticle(articleId: string, userId: string): Promise<IArticle | null> {
    return this.model.findByIdAndUpdate(articleId, { $addToSet: { dislikes: userId }, $pull: { likes: userId } }, { new: true }).exec();
  }


  async getArticlesByUser(userId: string): Promise<PopulatedArticle[]> {
    console.log("reached the repository");
    
      return this.model
      .aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "userId",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            _id:1,
            title: 1,
            content: 1,
            categoryName: 1,
            description: 1,
            tags: 1,
            status: 1,
            likes: 1,
            dislikes: 1,
            blockedUsers: 1,
            imageUrl: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: 1,
            "userInfo.firstName": 1,
            "userInfo.lastName": 1,
            "userInfo.profileImageUrl": 1,
          },
        },
      ])
      .exec();
  }


  async getUserArticleStats(userId: string): Promise<ArticleStats> {
       const stats = await this.model.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalArticles: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalViews: { $sum: "$views" }, // Assumes views field exists
          totalComments: { $sum: "$commentsCount" }, // Assumes commentsCount field exists
        },
      },
    ]).exec();

    return stats[0] || { totalArticles: 0, totalLikes: 0, totalViews: 0, totalComments: 0 };
  }

  async getArticleById(id: string): Promise<IArticle | null> {
      return this.model.findById(id).exec();
  }


  async updateArticle(id: string, data: Partial<IArticle>): Promise<IArticle | null> {
      return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteArticle(id: string): Promise<void> {
      await this.model.findByIdAndDelete(id).exec();
  }

}
