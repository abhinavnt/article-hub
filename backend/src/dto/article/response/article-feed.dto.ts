export interface ArticleFeedDto {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  status: "draft" | "published";
  categoryName: string;
  authorName: string;
  authorAvatar?: string;
  userLiked: boolean;
  userDisliked: boolean;
  likeCount: number;
  dislikeCount: number;
  blockCount: number;
  createdAt: Date;
  updatedAt: Date;
}