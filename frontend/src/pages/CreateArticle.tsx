"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ArticleFormData, Category, ValidationErrors } from "../types/article"
import { Save, Send } from "lucide-react"
import { Card } from "@/components/ui/CustomCard"
import { Input } from "@/components/ui/CustomInput"
import { ImageUpload } from "@/components/create-articles/ImageUpload"
import { Button } from "@/components/ui/CustomButton"
import { TagInput } from "@/components/create-articles/TagInput"
import { CreateCategoryModal } from "@/components/create-articles/CreateCategoryModal"
import { CategorySelector } from "@/components/create-articles/CategorySelector"
import { createCategory, getCategories, publishArticle, saveDraft } from "@/services/AddArticleService"

export const CreateArticle: React.FC = () => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    description: "",
    content: "",
    image: null,
    tags: [],
    category: "",
    newCategory: "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const availableCategories = await getCategories()
      setCategories(availableCategories)
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const validateField = (field: keyof ArticleFormData, value: any): string | undefined => {
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
    }
    return undefined
  }

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Real-time validation
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleCreateCategory = async (categoryName: string) => {
    try {
      const newCategory = await createCategory(categoryName)
      setCategories((prev) => [...prev, newCategory])
      handleInputChange("category", newCategory.name)
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const field = key as keyof ArticleFormData
      if (field !== "newCategory" && field !== "image") {
        const error = validateField(field, formData[field])
        if (error) {
          newErrors[field] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //api connected
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorElement = document.querySelector(".text-red-600")
      firstErrorElement?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setLoading(true)
    try {
      console.log(formData, "submitting form data")
      const response = await publishArticle(formData)

      alert(`🎉 Article "${response.title}" published successfully!\nArticle ID: ${response.id}`)

      setFormData({
        title: "",
        description: "",
        content: "",
        image: null,
        tags: [],
        category: "",
        newCategory: "",
      })

      await loadCategories()
    } catch (error) {
      console.error("Failed to publish article:", error)
      alert("❌ Failed to publish article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      alert("⚠️ Please add a title before saving as draft")
      return
    }

    setSavingDraft(true)
    try {
      const response = await saveDraft(formData)

      alert(`📝 Article "${response.title}" saved as draft!\nDraft ID: ${response.id}`)

      await loadCategories()
    } catch (error) {
      console.error("Failed to save draft:", error)
      alert("❌ Failed to save draft. Please try again.")
    } finally {
      setSavingDraft(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Article</h1>
          <p className="text-lg text-gray-600">Share your knowledge and inspire others</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <Input
              label="Article Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Write a compelling title that grabs attention..."
              error={errors.title}
            />

            {/* Description */}
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

            {/* Content */}
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

            {/* Image Upload */}
            <ImageUpload
              onImageSelect={(file) => handleInputChange("image", file)}
              error={errors.image}
              currentImage={formData.image}
            />

            {/* Category Selection - REPLACED WITH CategorySelector */}
            <CategorySelector
              categories={categories}
              selectedCategory={formData.category}
              onCategorySelect={(categoryName) => handleInputChange("category", categoryName)}
              onCreateNew={() => setShowCategoryModal(true)}
              error={errors.category}
              loading={loadingCategories}
            />

            {/* Tags */}
            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => handleInputChange("tags", tags)}
              error={errors.tags}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t-2 border-gray-100 space-y-4 sm:space-y-0 gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto"
                loading={savingDraft}
                disabled={savingDraft || loading}
              >
                <Save size={18} className="mr-2" />
                {savingDraft ? "Saving Draft..." : "Save as Draft"}
              </Button>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px]"
              >
                <Send size={18} className="mr-2" />
                {loading ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Create Category Modal */}
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
