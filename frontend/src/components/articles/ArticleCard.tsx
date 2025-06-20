
import type React from "react"
import type { Article } from "@/types/article"
import { Card } from "@/components/ui/CustomCard"
import { Button } from "@/components/ui/button"

interface ArticleCardProps {
  article: Article
  onView: (article: Article) => void
  onLike?: (id: string) => void
  onDislike?: (id: string) => void
  onBlock?: (id: string) => void
  showActions?: boolean
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onView,
  onLike,
  onDislike,
  onBlock,
  showActions = true,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {article.imageUrl && (
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <img
              src={article.authorAvatar || "/placeholder.svg?height=24&width=24"}
              alt={article.authorName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{article.authorName}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          <h3 className="text-lg font-semibold text-black line-clamp-2">{article.title}</h3>

          <p className="text-gray-600 text-sm line-clamp-3">{article.description}</p>

          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{article.likeCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span>{article.dislikeCount}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onView(article)}>
              Read More
            </Button>

            {showActions && (
              <div className="flex items-center space-x-1">
                {onLike && (
                  <button
                    onClick={() => onLike(article.id)}
                    className={`p-1 cursor-pointer rounded hover:bg-gray-100 ${article.userLiked ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                )}

                {onDislike && (
                  <button
                    onClick={() => onDislike(article.id)}
                    className={`p-1 cursor-pointer rounded hover:bg-gray-100 ${article.userDisliked ? "text-red-600" : "text-gray-400"}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                  </button>
                )}

                {onBlock && (
                  <button
                    onClick={() => onBlock(article.id)}
                    className="p-1 cursor-pointer rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
