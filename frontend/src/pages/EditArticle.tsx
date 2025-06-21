import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Save, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/CustomCard"
import { Input } from "@/components/ui/CustomInput"
import { ImageUpload } from "@/components/create-articles/ImageUpload"
import { Button } from "@/components/ui/CustomButton"
import { TagInput } from "@/components/create-articles/TagInput"
import { CreateCategoryModal } from "@/components/create-articles/CreateCategoryModal"
import { Loading } from "@/components/ui/Loading"
import { useAppSelector } from "@/redux/store"
import { getArticleById, updateArticle } from "@/services/articleService"
import { getCategories, createCategory } from "@/services/AddArticleService"
import { CategorySelector } from "@/components/create-articles/CategorySelector"
import type { EditArticleFormData, EditArticleType, EditCategory, EditValidationErrors } from "@/types/article"


export const EditArticle: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [article, setArticle] = useState<EditArticleType | null>(null)
  const [formData, setFormData] = useState<EditArticleFormData>({
    title: "",
    description: "",
    content: "",
    image: null,
    tags: [],
    category: "",
    newCategory: "",
    status: "draft",
  })
  const [categories, setCategories] = useState<EditCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [errors, setErrors] = useState<EditValidationErrors>({})
  const [showCategoryModal, setShowCategoryModal] = useState(false)

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
        getArticleById(id) ,
        getCategories() as Promise<EditCategory[]>,
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
        image: null,
        tags: articleData.tags,
        category: articleData.category,
        newCategory: "",
        status: articleData.status || "draft",
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

  const validateField = (field: keyof EditArticleFormData, value: any): string | undefined => {
    switch (field) {
      case "title":
        if (!value || !value.trim()) return "Title is required"
        if (value.trim().length < 5) return "Title must be at least 5 characters"
        if (value.trim().length > 100) return "Title must be less than 100 characters"
        break
      case "description":
        if (!value || !value.trim()) return "Description is required"
        if (value.trim().length < 10) return "Description must be at least 10 characters"
        if (value.trim().length > 300) return "Description cannot exceed 300 characters"
        break
      case "content":
        if (!value || !value.trim()) return "Content is required"
        if (value.trim().length < 50) return "Content must be at least 50 characters"
        if (value.trim().length > 5000) return "Content cannot exceed 5000 characters"
        break
      case "category":
        if (!value) return "Please select a category"
        break
      case "tags":
        if (!Array.isArray(value) || value.length === 0) return "At least one tag is required"
        break
      case "status":
        if (!["draft", "published"].includes(value)) return "Invalid status"
        break
    }
    return undefined
  }

  const handleInputChange = (field: keyof EditArticleFormData, value: any) => {
    setFormData((prev: EditArticleFormData) => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors((prev: EditValidationErrors) => ({ ...prev, [field]: error }))
  }

  const handleCreateCategory = async (categoryName: string) => {
    try {
      const newCategory = await createCategory(categoryName) as EditCategory
      setCategories((prev) => [...prev, newCategory])
      handleInputChange("category", newCategory.name)
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: EditValidationErrors = {}
    Object.keys(formData).forEach((key) => {
      const field = key as keyof EditArticleFormData
      if (field !== "newCategory" && field !== "image") {
        const error = validateField(field, formData[field])
        if (error) newErrors[field] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user || !id) {
      const firstErrorElement = document.querySelector(".text-red-600")
      firstErrorElement?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("content", formData.content)
      console.log(formData.image,"form image");
      
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }
      formDataToSend.append("tags", JSON.stringify(formData.tags))
      formDataToSend.append("category", formData.category)
      formDataToSend.append("status", formData.status)
      if (formData.newCategory) {
        formDataToSend.append("newCategory", formData.newCategory)
      }

      await updateArticle(id, formDataToSend)
      alert(`🎉 Article "${formData.title}" updated successfully!`)
      navigate("/my-articles")
    } catch (error) {
      console.error("Failed to update article:", error)
      alert("❌ Failed to update article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading article..." />
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-articles")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to My Articles
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Article</h1>
            <p className="text-lg text-gray-600">Update your article content and settings</p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Article Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Write a compelling title that grabs attention..."
              error={errors.title}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-sm ${
                    formData.description.length > 300
                      ? "text-red-500"
                      : formData.description.length > 250
                        ? "text-yellow-600"
                        : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/300
                </span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide a brief, engaging description of your article..."
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-500 bg-red-50 focus:border-red-600"
                    : "border-gray-200 focus:border-black bg-white hover:border-gray-300"
                }`}
              />
              {errors.description && <p className="text-sm text-red-600 font-medium">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-900">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-sm ${
                    formData.content.length > 5000
                      ? "text-red-500"
                      : formData.content.length > 4500
                        ? "text-yellow-600"
                        : "text-gray-500"
                  }`}
                >
                  {formData.content.length}/5000
                </span>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your article content here. Share your insights, experiences, and knowledge..."
                rows={16}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 resize-y ${
                  errors.content
                    ? "border-red-500 bg-red-50 focus:border-red-600"
                    : "border-gray-200 focus:border-black bg-white hover:border-gray-300"
                }`}
              />
              {errors.content && <p className="text-sm text-red-600 font-medium">{errors.content}</p>}
            </div>

            <ImageUpload
              onImageSelect={(file) => handleInputChange("image", file)}
              error={errors.image}
              currentImage={formData.image}
              existingImageUrl={article.imageUrl}
            />

            <CategorySelector
              categories={categories}
              selectedCategory={formData.category}
              onCategorySelect={(categoryName) => handleInputChange("category", categoryName)}
              onCreateNew={() => setShowCategoryModal(true)}
              error={errors.category}
              loading={loadingCategories}
            />

            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => handleInputChange("tags", tags)}
              error={errors.tags}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 ${
                  errors.status
                    ? "border-red-500 bg-red-50 focus:border-red-600"
                    : "border-gray-200 focus:border-black bg-white hover:border-gray-300"
                }`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {errors.status && <p className="text-sm text-red-600 font-medium">{errors.status}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t-2 border-gray-100 space-y-4 sm:space-y-0 gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/my-articles")}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <ArrowLeft size={18} className="mr-2" />
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px]"
              >
                <Save size={18} className="mr-2" />
                {loading ? "Updating..." : "Update Article"}
              </Button>
            </div>
          </form>
        </Card>

        <CreateCategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onCreateCategory={handleCreateCategory}
          existingCategories={categories.map((cat) => cat.name)}
        />
      </div>
    </div>
  )
}