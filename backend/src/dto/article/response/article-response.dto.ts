import { CategoryResponseDto } from "./category-response.dto";

export class ArticleResponseDto {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  categoryName: string;
  userId: string;
  status: string;
  likeCount: number;
  dislikeCount: number;
  blockedCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(article: any) {
    this.id = article._id.toString();
    this.title = article.title;
    this.description = article.description;
    this.content = article.content;
    this.imageUrl = article.imageUrl;
    this.tags = article.tags;
    this.categoryName = article.categoryName
    this.userId = article.userId;
    this.status = article.status;
    this.likeCount = article.likes.length;
    this.dislikeCount = article.dislikes.length;
    this.blockedCount = article.blockedUsers.length;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
  }
}





export class ArticleStatsDto {
  totalArticles: number;
  totalLikes: number;
  totalViews: number;
  totalComments: number;

  constructor(stats: any) {
    this.totalArticles = stats.totalArticles || 0;
    this.totalLikes = stats.totalLikes || 0;
    this.totalViews = stats.totalViews || 0;
    this.totalComments = stats.totalComments || 0;
  }
}

export class ArticleUpdateDto {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  categoryName: string;

  constructor(data: any) {
    this.title = data.title;
    this.description = data.description;
    this.content = data.content;
    this.imageUrl = data.imageUrl;
    this.tags = data.tags;
    this.categoryName = data.categoryName;
  }
}