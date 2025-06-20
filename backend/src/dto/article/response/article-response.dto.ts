import { CategoryResponseDto } from "./category-response.dto";

export class ArticleResponseDto {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  category: CategoryResponseDto;
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
    this.category = new CategoryResponseDto(article.categoryId); 
    this.userId = article.userId;
    this.status = article.status;
    this.likeCount = article.likes.length;
    this.dislikeCount = article.dislikes.length;
    this.blockedCount = article.blockedUsers.length;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
  }
}