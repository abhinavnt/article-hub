import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { Article, ArticleStats } from "@/types/article"
import { ArticleModal } from "@/components/articles/ArticleModal"
import { Loading } from "@/components/ui/Loading"
import { useAppSelector } from "@/redux/store"
import { Button } from "@/components/ui/CustomButton"
import { Card } from "@/components/ui/CustomCard"
import { deleteArticle, getUserArticles, getUserArticleStats } from "@/services/articleService"
import { toast } from "sonner"
import { ArticleCardWithActions } from "@/components/my-articles/ArticleCardWithActions"
import { ConfirmationModal } from "@/components/ui/DeleteConfirmationModal"






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
