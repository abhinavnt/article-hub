
import type React from "react"
import { useState } from "react"

import { Plus, Folder } from "lucide-react"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/CustomInput"
import { Button } from "../ui/CustomButton"

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCategory: (categoryName: string) => void
  existingCategories: string[]
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreateCategory,
  existingCategories,
}) => {
  const [categoryName, setCategoryName] = useState("")
  const [error, setError] = useState("")

  const validateCategory = (name: string): string => {
    if (!name.trim()) return "Category name is required"
    if (name.trim().length < 2) return "Category name must be at least 2 characters"
    if (name.trim().length > 30) return "Category name must be less than 30 characters"
    if (existingCategories.some((cat) => cat.toLowerCase() === name.toLowerCase())) {
      return "This category already exists"
    }
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateCategory(categoryName)

    if (validationError) {
      setError(validationError)
      return
    }

    onCreateCategory(categoryName.trim())
    setCategoryName("")
    setError("")
    onClose()
  }

  const handleClose = () => {
    setCategoryName("")
    setError("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Category">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Folder className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <Input
          label="Category Name"
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value.toUpperCase()) 
            if (error) setError("")
          }}
          placeholder="e.g., Web Development, Data Science"
          error={error}
          required
        />

        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-2 font-medium">Existing Categories:</p>
          <div className="flex flex-wrap gap-2">
            {existingCategories.slice(0, 6).map((category) => (
              <span key={category} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-lg border">
                {category}
              </span>
            ))}
            {existingCategories.length > 6 && (
              <span className="px-2 py-1 text-gray-500 text-xs">+{existingCategories.length - 6} more</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            <Plus size={16} className="mr-2" />
            Create Category
          </Button>
        </div>
      </form>
    </Modal>
  )
}
