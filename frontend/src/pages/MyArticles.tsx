
// import type React from "react"
// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import type { Article, ArticleStats } from "@/types/article"
// import { articleService } from "@/services/articleService"
// import { ArticleCard } from "@/components/articles/ArticleCard"
// import { ArticleModal } from "@/components/articles/ArticleModal"
// import { Loading } from "@/components/ui/Loading"
// import { useAppSelector } from "@/redux/store"
// import { Button } from "@/components/ui/CustomButton"
// import { Card } from "@/components/ui/CustomCard"

// export const MyArticles: React.FC = () => {
//   const { user } = useAppSelector((state) => state.auth)
//   const navigate = useNavigate()
//   const [articles, setArticles] = useState<Article[]>([])
//   const [stats, setStats] = useState<ArticleStats | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
//   const [showModal, setShowModal] = useState(false)
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

//   useEffect(() => {
//     loadData()
//   }, [user])

//   const loadData = async () => {
//     if (!user) return

//     setLoading(true)
//     try {
//       const [userArticles, userStats] = await Promise.all([
//         articleService.getUserArticles(user.userId),
//         articleService.getUserArticleStats(user.userId),
//       ])
//       setArticles(userArticles)
//       setStats(userStats)
//     } catch (error) {
//       console.error("Failed to load user articles:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleViewArticle = (article: Article) => {
//     setSelectedArticle(article)
//     setShowModal(true)
//   }

//   const handleEditArticle = (article: Article) => {
//     navigate(`/edit-article/${article.id}`)
//   }

//   const handleDeleteArticle = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this article?")) return

//     setDeleteLoading(id)
//     try {
//       await articleService.deleteArticle(id)
//       setArticles((prev) => prev.filter((article) => article.id !== id))
//       if (selectedArticle?.id === id) {
//         setShowModal(false)
//         setSelectedArticle(null)
//       }
//     } catch (error) {
//       console.error("Failed to delete article:", error)
//       alert("Failed to delete article. Please try again.")
//     } finally {
//       setDeleteLoading(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loading size="lg" text="Loading your articles..." />
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-black">My Articles</h1>
//             <p className="text-gray-600 mt-2">Manage your published articles</p>
//           </div>
//           <Button onClick={() => navigate("/create-article")}>Create New Article</Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-black">{stats.totalArticles}</div>
//               <div className="text-sm text-gray-600">Total Articles</div>
//             </div>
//           </Card>
//           <Card>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-black">{stats.totalLikes}</div>
//               <div className="text-sm text-gray-600">Total Likes</div>
//             </div>
//           </Card>
//           <Card>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-black">{stats.totalViews}</div>
//               <div className="text-sm text-gray-600">Total Views</div>
//             </div>
//           </Card>
//           <Card>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-black">{stats.totalComments}</div>
//               <div className="text-sm text-gray-600">Total Comments</div>
//             </div>
//           </Card>
//         </div>
//       )}

//       {articles.length === 0 ? (
//         <div className="text-center py-12">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No articles yet</h3>
//           <p className="mt-1 text-sm text-gray-500">Get started by creating your first article.</p>
//           <div className="mt-6">
//             <Button onClick={() => navigate("/create-article")}>Create Your First Article</Button>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {articles.map((article) => (
//             <div key={article.id} className="relative">
//               <ArticleCard article={article} onView={handleViewArticle} showActions={false} />

//               {/* Article Actions */}
//               <div className="absolute top-4 right-4 flex items-center space-x-2">
//                 <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   loading={deleteLoading === article.id}
//                   onClick={() => handleDeleteArticle(article.id)}
//                 >
//                   Delete
//                 </Button>
//               </div>

//               {/* Article Stats */}
//               <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div>
//                     <div className="text-lg font-semibold text-black">{article.likes}</div>
//                     <div className="text-xs text-gray-600">Likes</div>
//                   </div>
//                   <div>
//                     <div className="text-lg font-semibold text-black">{article.dislikes}</div>
//                     <div className="text-xs text-gray-600">Dislikes</div>
//                   </div>
//                   <div>
//                     <div className="text-lg font-semibold text-black">{article.blocks}</div>
//                     <div className="text-xs text-gray-600">Blocks</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <ArticleModal
//         article={selectedArticle}
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         showActions={false}
//       />
//     </div>
//   )
// }
