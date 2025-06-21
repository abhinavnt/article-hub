"use client"

import type React from "react"
import type { Article } from "@/types/article"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/CustomButton"

interface ArticleModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
  onLike?: (id: string) => void
  onDislike?: (id: string) => void
  onBlock?: (id: string) => void
  showActions?: boolean
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  onLike,
  onDislike,
  showActions = true,
}) => {
  if (!article) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        {article.imageUrl && (
          <div className="w-full">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=256&width=400"
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <img
              src={article.authorAvatar || "/placeholder.svg?height=40&width=40"}
              alt={article.authorName}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=40&width=40"
              }}
            />
            <div>
              <p className="font-medium text-black">{article.authorName}</p>
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-black leading-tight">{article.title}</h1>

          {/* Category and Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-black text-white text-sm rounded-full">{article.category}</span>
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-base mb-4">{article.description}</p>
            <div className="mt-4 space-y-4">
              {article.content.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p key={index} className="text-gray-700 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  ),
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{article.likeCount} likes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>{article.dislikeCount} dislikes</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onLike && (
                <Button variant={article.userLiked ? "primary" : "outline"} size="sm" onClick={() => onLike(article.id)}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {article.userLiked ? "Liked" : "Like"}
                </Button>
              )}

              {onDislike && (
                <Button
                  variant={article.userDisliked ? "danger" : "outline"}
                  size="sm"
                  onClick={() => onDislike(article.id)}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                  {article.userDisliked ? "Disliked" : "Dislike"}
                </Button>
              )}

              {/* {onBlock && !article.isBlocked && (
                <Button variant="outline" size="sm" onClick={() => onBlock(article.id)}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                    />
                  </svg>
                  Block
                </Button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
