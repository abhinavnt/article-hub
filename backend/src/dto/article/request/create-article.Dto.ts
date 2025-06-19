export interface CreateArticleDto {
  title: string;
  description: string;
  content: string;
  category: string; // Category name from frontend
  tags: string[];
  imageUrl?: string;
}