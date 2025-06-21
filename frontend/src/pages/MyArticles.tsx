import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { Article, ArticleStats } from "@/types/article"
import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArticleModal } from "@/components/articles/ArticleModal"
import { Loading } from "@/components/ui/Loading"
import { useAppSelector } from "@/redux/store"
import { Button } from "@/components/ui/CustomButton"
import { Card } from "@/components/ui/CustomCard"
import { deleteArticle, getUserArticles, getUserArticleStats } from "@/services/articleService"
import { toast } from "sonner"

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed backdrop-blur-md inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0  bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Article Card with Actions
interface ArticleCardWithActionsProps {
  article: Article
  onView: (article: Article) => void
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  deleteLoading: boolean
}

const ArticleCardWithActions: React.FC<ArticleCardWithActionsProps> = ({
  article,
  onView,
  onEdit,
  onDelete,
  deleteLoading,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Article Content */}
      <div className="cursor-pointer" onClick={() => onView(article)}>
        <ArticleCard article={article} onView={onView} showActions={false} />
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-2 flex-1">
            <button
              onClick={() => onEdit(article)}
              className="flex-1 px-3 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(article)}
              disabled={deleteLoading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 flex items-center justify-center"
            >
              {deleteLoading && (
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const MyArticles: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<ArticleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [userArticles, userStats] = await Promise.all([getUserArticles(), getUserArticleStats()])
      setArticles(userArticles)
      setStats(userStats)
    } catch (error) {
      console.error("Failed to load user articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const handleEditArticle = (article: Article) => {
    navigate(`/edit-article/${article.id}`)
  }

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return

    setDeleteLoading(articleToDelete.id)
    try {
      await deleteArticle(articleToDelete.id)
      setArticles((prev) => prev.filter((article) => article.id !== articleToDelete.id))
      if (selectedArticle?.id === articleToDelete.id) {
        setShowModal(false)
        setSelectedArticle(null)
      }
      setShowDeleteConfirm(false)
      setArticleToDelete(null)
      toast.success("article delete success")
    } catch (error) {
      console.error("Failed to delete article:", error)
       toast.error("Failed to delete article. Please try again.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setArticleToDelete(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading your articles..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">My Articles</h1>
              <p className="text-gray-600 mt-2">Manage your published articles</p>
            </div>
            <Button
              onClick={() => navigate("/create-article")}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
            >
              Create New Article
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{stats.totalArticles}</div>
                <div className="text-sm text-gray-600 mt-1">Total Articles</div>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{stats.totalLikes}</div>
                <div className="text-sm text-gray-600 mt-1">Total Likes</div>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{stats.totalViews}</div>
                <div className="text-sm text-gray-600 mt-1">Total Views</div>
              </div>
            </Card>
            <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{stats.totalComments}</div>
                <div className="text-sm text-gray-600 mt-1">Total Comments</div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Section */}
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-black mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first article and share your thoughts with the world.
            </p>
            <Button
              onClick={() => navigate("/create-article")}
              className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Create Your First Article
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCardWithActions
                key={article.id}
                article={article}
                onView={handleViewArticle}
                onEdit={handleEditArticle}
                onDelete={handleDeleteClick}
                deleteLoading={deleteLoading === article.id}
              />
            ))}
          </div>
        )}

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          showActions={false}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Article"
          message={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
          loading={deleteLoading === articleToDelete?.id}
        />
      </div>
    </div>
  )
}
