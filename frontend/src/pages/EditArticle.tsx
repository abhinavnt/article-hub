
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Article, ArticleFormData } from "@/types/article"
import { articleService } from "@/services/articleService"
import { Loading } from "@/components/ui/Loading"
import { useAppSelector } from "@/redux/store"
import { Card } from "@/components/ui/CustomCard"
import { Input } from "@/components/ui/CustomInput"
import { Button } from "@/components/ui/CustomButton"

export const EditArticle: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    tags: [],
    category: "",
  })
  const [categories, setCategories] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errors, setErrors] = useState<Partial<ArticleFormData>>({})

  useEffect(() => {
    loadArticleAndCategories()
  }, [id])

  const loadArticleAndCategories = async () => {
    if (!id) {
      navigate("/my-articles")
      return
    }

    setInitialLoading(true)
    try {
      const [articleData, availableCategories] = await Promise.all([
        articleService.getArticleById(id),
        articleService.getCategories(),
      ])

      if (!articleData) {
        alert("Article not found")
        navigate("/my-articles")
        return
      }

      setArticle(articleData)
      setFormData({
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        imageUrl: articleData.imageUrl || "",
        tags: articleData.tags,
        category: articleData.category,
      })
      setCategories(availableCategories)
    } catch (error) {
      console.error("Failed to load article:", error)
      alert("Failed to load article")
      navigate("/my-articles")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ArticleFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (formData.tags.length === 0) {
      newErrors.tags = ["At least one tag is required"]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user || !id) return

    setLoading(true)
    try {
      await articleService.updateArticle(id, formData)
      alert("Article updated successfully!")
      navigate("/my-articles")
    } catch (error) {
      console.error("Failed to update article:", error)
      alert("Failed to update article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading article..." />
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Edit Article</h1>
        <p className="text-gray-600 mt-2">Update your article content</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Article Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter a compelling title for your article"
            error={errors.title}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Write a brief description of your article"
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.description ? "border-red-500" : ""
              }`}
              required
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your article content here..."
              rows={10}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.content ? "border-red-500" : ""
              }`}
              required
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <Input
            label="Image URL (Optional)"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            type="url"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.category ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add Tag
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {errors.tags && <p className="mt-1 text-sm text-red-600">At least one tag is required</p>}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => navigate("/my-articles")}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? "Updating..." : "Update Article"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
