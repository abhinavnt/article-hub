import type { Article } from "@/types/article"
import { ArticleCard } from "../articles/ArticleCard"


// Enhanced Article Card with Actions
interface ArticleCardWithActionsProps {
  article: Article
  onView: (article: Article) => void
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  deleteLoading: boolean
}



export 
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