export interface Article {
  id: string
  title: string
  description: string
  content: string
  imageUrl?: string
  tags: string[]
  category: string
  authorId: string
  authorName: string
  authorAvatar?: string
  likeCount: number
  dislikeCount: number
  blocks: number
  userLiked?: boolean
  userDisliked?: boolean
  blockCount?: boolean
  createdAt: Date
  updatedAt: Date
}



export interface ArticleStats {
  totalArticles: number
  totalLikes: number
  totalViews: number
  totalComments: number
}


export interface ArticleFormData {
  title: string
  description: string
  content: string
  image?: File | null
  tags: string[]
  category: string
  newCategory?: string
}

export interface Category {
  id: string
  name: string
  createdAt: string
}

export interface ValidationErrors {
  title?: string
  description?: string
  content?: string
  image?: string
  tags?: string
  category?: string
  newCategory?: string
}


export interface ArticleSubmissionData {
  title: string
  description: string
  content: string
  imageUrl?: string
  tags: string[]
  categoryId: string
  categoryName: string
  isNewCategory: boolean
  status: "draft" | "published"
  userId: string
}

export interface ArticleResponse {
  id: string
  title: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}


export interface EditArticleType {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  category: string;
  userId: string;
  status: "draft" | "published";
}

export interface EditArticleFormData {
  title: string;
  description: string;
  content: string;
  image: File | null;
  tags: string[];
  category: string;
  newCategory: string;
  status: "draft" | "published";
}

export interface EditCategory {
  id: string;
  name: string;
}

export interface EditValidationErrors {
  [key: string]: string | undefined;
}