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

export interface ArticleFormData {
  title: string
  description: string
  content: string
  imageUrl?: string
  tags: string[]
  category: string
}

export interface ArticleStats {
  totalArticles: number
  totalLikes: number
  totalViews: number
  totalComments: number
}
