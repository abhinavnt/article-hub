import type { Article, ArticleFormData, ArticleStats } from "@/types/article"

// Dummy data for articles
const dummyArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Technology",
    description: "Exploring emerging technologies and their impact on society",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imageUrl: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/08/BMD-3398.png",
    tags: ["technology", "future", "innovation"],
    category: "Technology",
    authorId: "user1",
    authorName: "John Doe",
    authorAvatar: "https://tse3.mm.bing.net/th?id=OIP.Qvf9UmzJS1V5YafT9NQZlAHaKL&pid=Api&P=0&h=180",
    likes: 45,
    dislikes: 3,
    blocks: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Healthy Living Tips",
    description: "Simple ways to maintain a healthy lifestyle",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["health", "lifestyle", "wellness"],
    category: "Health",
    authorId: "user2",
    authorName: "Jane Smith",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 32,
    dislikes: 2,
    blocks: 0,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Travel Adventures",
    description: "Discovering hidden gems around the world",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["travel", "adventure", "exploration"],
    category: "Travel",
    authorId: "user3",
    authorName: "Mike Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 28,
    dislikes: 1,
    blocks: 0,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    title: "Cooking Masterclass",
    description: "Learn professional cooking techniques at home",
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["cooking", "food", "recipes"],
    category: "Food",
    authorId: "user4",
    authorName: "Sarah Wilson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 67,
    dislikes: 4,
    blocks: 2,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "Investment Strategies",
    description: "Smart ways to grow your wealth",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["finance", "investment", "money"],
    category: "Finance",
    authorId: "user5",
    authorName: "David Brown",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 89,
    dislikes: 7,
    blocks: 3,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    title: "Modern Web Development",
    description: "Latest trends in web development and best practices",
    content:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["web", "development", "programming"],
    category: "Technology",
    authorId: "demo-user-1",
    authorName: "John Doe",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 156,
    dislikes: 8,
    blocks: 2,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "7",
    title: "Mental Health Awareness",
    description: "Understanding and managing mental health in daily life",
    content:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.",
    imageUrl: "/placeholder.svg?height=200&width=400",
    tags: ["mental-health", "wellness", "self-care"],
    category: "Health",
    authorId: "demo-user-1",
    authorName: "John Doe",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    likes: 203,
    dislikes: 12,
    blocks: 5,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
]

const categories = ["Technology", "Health", "Travel", "Food", "Finance", "Sports", "Education", "Entertainment"]

export const articleService = {
  // Get articles based on user preferences
  getArticlesByPreferences: async (preferences: string[]): Promise<Article[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredArticles = dummyArticles.filter((article) =>
          preferences.some(
            (pref) =>
              article.category.toLowerCase().includes(pref.toLowerCase()) ||
              article.tags.some((tag) => tag.toLowerCase().includes(pref.toLowerCase())),
          ),
        )
        resolve(filteredArticles)
      }, 500)
    })
  },

  // Get all articles
  getAllArticles: async (): Promise<Article[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyArticles)
      }, 500)
    })
  },

  // Get articles by user
  getUserArticles: async (userId: string): Promise<Article[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userArticles = dummyArticles.filter((article) => article.authorId === userId)
        resolve(userArticles)
      }, 500)
    })
  },

  // Get single article
  getArticleById: async (id: string): Promise<Article | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = dummyArticles.find((article) => article.id === id)
        resolve(article || null)
      }, 300)
    })
  },

  // Create article
  createArticle: async (articleData: ArticleFormData, authorId: string): Promise<Article> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newArticle: Article = {
          id: Date.now().toString(),
          ...articleData,
          authorId,
          authorName: "John Doe", // Demo user name
          authorAvatar: "/placeholder.svg?height=40&width=40",
          likes: 0,
          dislikes: 0,
          blocks: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        dummyArticles.unshift(newArticle)
        resolve(newArticle)
      }, 800)
    })
  },

  // Update article
  updateArticle: async (id: string, articleData: Partial<ArticleFormData>): Promise<Article> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = dummyArticles.findIndex((article) => article.id === id)
        if (index === -1) {
          reject(new Error("Article not found"))
          return
        }

        dummyArticles[index] = {
          ...dummyArticles[index],
          ...articleData,
          updatedAt: new Date(),
        }
        resolve(dummyArticles[index])
      }, 800)
    })
  },

  // Delete article
  deleteArticle: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = dummyArticles.findIndex((article) => article.id === id)
        if (index === -1) {
          reject(new Error("Article not found"))
          return
        }
        dummyArticles.splice(index, 1)
        resolve()
      }, 500)
    })
  },

  // Like article
  likeArticle: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = dummyArticles.find((a) => a.id === id)
        if (article) {
          if (article.isLiked) {
            article.likes--
            article.isLiked = false
          } else {
            article.likes++
            article.isLiked = true
            if (article.isDisliked) {
              article.dislikes--
              article.isDisliked = false
            }
          }
        }
        resolve()
      }, 300)
    })
  },

  // Dislike article
  dislikeArticle: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = dummyArticles.find((a) => a.id === id)
        if (article) {
          if (article.isDisliked) {
            article.dislikes--
            article.isDisliked = false
          } else {
            article.dislikes++
            article.isDisliked = true
            if (article.isLiked) {
              article.likes--
              article.isLiked = false
            }
          }
        }
        resolve()
      }, 300)
    })
  },

  // Block article
  blockArticle: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = dummyArticles.find((a) => a.id === id)
        if (article) {
          article.blocks++
          article.isBlocked = true
        }
        resolve()
      }, 300)
    })
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories)
      }, 200)
    })
  },

  // Get user article stats
  getUserArticleStats: async (userId: string): Promise<ArticleStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userArticles = dummyArticles.filter((article) => article.authorId === userId)
        const stats: ArticleStats = {
          totalArticles: userArticles.length,
          totalLikes: userArticles.reduce((sum, article) => sum + article.likes, 0),
          totalViews: userArticles.length * 150, // Mock views
          totalComments: userArticles.length * 25, // Mock comments
        }
        resolve(stats)
      }, 400)
    })
  },
}
