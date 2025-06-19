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
  likes: number
  dislikes: number
  blocks: number
  isLiked?: boolean
  isDisliked?: boolean
  isBlocked?: boolean
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