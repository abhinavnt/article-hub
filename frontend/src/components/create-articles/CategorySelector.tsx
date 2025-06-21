"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Plus, Check, Folder } from "lucide-react"
import { Button } from "../ui/CustomButton"

interface Category {
  id: string
  name: string
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryName: string) => void
  onCreateNew: () => void
  error?: string
  loading?: boolean
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onCreateNew,
  error,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedCategoryObj = categories.find((cat) => cat.name === selectedCategory)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCategorySelect = (categoryName: string) => {
    onCategorySelect(categoryName)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleToggle = () => {
    if (!loading) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900">
          Category <span className="text-red-500">*</span>
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCreateNew}
          className="text-black hover:bg-black hover:text-white transition-colors"
          disabled={loading}
        >
          <Plus size={16} className="mr-1" />
          New Category
        </Button>
      </div>

      <div className="relative" ref={dropdownRef}>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
        ) : (
          <>
            {/* Main Selector Button */}
            <button
              type="button"
              onClick={handleToggle}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 text-left flex items-center justify-between ${
                error
                  ? "border-red-500 bg-red-50 focus:border-red-600"
                  : isOpen
                    ? "border-black bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center">
                {selectedCategoryObj ? (
                  <>
                    <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                      <Folder size={16} className="text-gray-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{selectedCategoryObj.name}</span>
                  </>
                ) : (
                  <span className="text-gray-500">Select a category for your article</span>
                )}
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                  />
                </div>

                {/* Categories List */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    <div className="p-2">
                      {filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.name)}
                          className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                            selectedCategory === category.name
                              ? "bg-black text-white hover:bg-gray-800"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`p-1.5 rounded-lg mr-3 ${
                                selectedCategory === category.name ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <Folder
                                size={14}
                                className={selectedCategory === category.name ? "text-gray-300" : "text-gray-600"}
                              />
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          {selectedCategory === category.name && <Check size={16} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                        <Folder size={20} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        {searchTerm ? `No categories found for "${searchTerm}"` : "No categories available"}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onCreateNew()
                          setIsOpen(false)
                        }}
                        className="mt-2 text-black hover:bg-black hover:text-white"
                      >
                        <Plus size={14} className="mr-1" />
                        Create New Category
                      </Button>
                    </div>
                  )}
                </div>

                {/* Create New Category Footer */}
                {filteredCategories.length > 0 && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onCreateNew()
                        setIsOpen(false)
                      }}
                      className="w-full text-black hover:bg-black hover:text-white justify-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Category
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {/* Category Stats */}
      {categories.length > 0 && !loading && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>{categories.length} categories available</span>
          {selectedCategory && <span className="text-green-600 font-medium">✓ Category selected</span>}
        </div>
      )}
    </div>
  )
}
