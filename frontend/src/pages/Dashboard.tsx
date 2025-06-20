import type React from "react";
import { useState, useEffect } from "react";
import type { Article } from "@/types/article";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useAppSelector } from "@/redux/store";

import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/CustomButton";
import { ArticleModal } from "@/components/articles/ArticleModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { blockArticle, dislikeArticle, getAllArticles, getArticlesByPreferences, likeArticle } from "@/services/articleService";

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    loadArticles(1);
  }, [user, showAllCategories]);

  const loadArticles = async (currentPage: number) => {
    if (!user) return;

    setLoading(true);
    try {
      let fetchedArticles: Article[];
      if (showAllCategories) {
        fetchedArticles = await getAllArticles(currentPage, pageSize);
      } else {
        fetchedArticles = await getArticlesByPreferences(currentPage, pageSize);
      }
      if (fetchedArticles.length < pageSize) {
        setHasMore(false);
      }
      setArticles((prev) => [...prev, ...fetchedArticles]);
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleLike = async (id: string) => {
    setActionLoading(id);
    try {
      await likeArticle(id);
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? {
                ...article,
                likes: article.isLiked ? article.likes - 1 : article.likes + 1,
                dislikes: article.isDisliked ? article.dislikes - 1 : article.dislikes,
                isLiked: !article.isLiked,
                isDisliked: false,
              }
            : article
        )
      );
      if (selectedArticle?.id === id) {
        setSelectedArticle((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
                dislikes: prev.isDisliked ? prev.dislikes - 1 : prev.dislikes,
                isLiked: !prev.isLiked,
                isDisliked: false,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to like article:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDislike = async (id: string) => {
    setActionLoading(id);
    try {
      await dislikeArticle(id);
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? {
                ...article,
                dislikes: article.isDisliked ? article.dislikes - 1 : article.dislikes + 1,
                likes: article.isLiked ? article.likes - 1 : article.likes,
                isDisliked: !article.isDisliked,
                isLiked: false,
              }
            : article
        )
      );
      if (selectedArticle?.id === id) {
        setSelectedArticle((prev) =>
          prev
            ? {
                ...prev,
                dislikes: prev.isDisliked ? prev.dislikes - 1 : prev.dislikes + 1,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes,
                isDisliked: !prev.isDisliked,
                isLiked: false,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to dislike article:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (id: string) => {
    setActionLoading(id);
    try {
      await blockArticle(id);
      setArticles((prev) => prev.filter((article) => article.id !== id));
      if (selectedArticle?.id === id) {
        setShowModal(false);
        setSelectedArticle(null);
      }
    } catch (error) {
      console.error("Failed to block article:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading your personalized articles..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-2">
              {showAllCategories
                ? "Discover articles from all categories"
                : "Articles curated based on your preferences"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant={showAllCategories ? "outline" : "primary"} onClick={() => setShowAllCategories(false)}>
              My Preferences
            </Button>
            <Button variant={showAllCategories ? "primary" : "outline"} onClick={() => setShowAllCategories(true)}>
              All Categories
            </Button>
          </div>
        </div>

        {!showAllCategories && user?.articlePreferences && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Your preferences:</p>
            <div className="flex flex-wrap gap-2">
              {user.articlePreferences.map((pref) => (
                <span key={pref} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <InfiniteScroll
        dataLength={articles.length}
        next={() => {
          const nextPage = page + 1;
          setPage(nextPage);
          loadArticles(nextPage);
        }}
        hasMore={hasMore}
        loader={<Loading size="md" text="Loading more articles..." />}
        endMessage={<p className="text-center text-gray-500 mt-4">No more articles</p>}
      >
        {articles.length === 0 && page === 1 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {showAllCategories
                ? "No articles are available at the moment."
                : "No articles match your preferences. Try exploring all categories."}
            </p>
            {!showAllCategories && (
              <div className="mt-6">
                <Button onClick={() => setShowAllCategories(true)}>Explore All Categories</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onView={handleViewArticle}
                onLike={handleLike}
                onDislike={handleDislike}
                onBlock={handleBlock}
                showActions={true}
              />
            ))}
          </div>
        )}
      </InfiniteScroll>

      <ArticleModal
        article={selectedArticle}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLike={handleLike}
        onDislike={handleDislike}
        onBlock={handleBlock}
        showActions={true}
      />
    </div>
  );
};