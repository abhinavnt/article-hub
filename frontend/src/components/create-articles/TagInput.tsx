import type React from "react"
import { useState } from "react"
import { X, Plus, Hash } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  error?: string
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, error }) => {
  const [inputValue, setInputValue] = useState("")
  const [isInputFocused, setIsInputFocused] = useState(false)

  const addTag = () => {
    const trimmedTag = inputValue.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onTagsChange([...tags, trimmedTag])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        Tags <span className="text-red-500">*</span>
        <span className="text-gray-500 font-normal ml-2">({tags.length}/10)</span>
      </label>

      <div
        className={`min-h-[3.5rem] p-3 border-2 rounded-xl transition-all duration-200 ${
          isInputFocused
            ? "border-black bg-white"
            : error
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 bg-black text-white text-sm rounded-lg font-medium group hover:bg-gray-800 transition-colors"
            >
              <Hash size={12} className="mr-1" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-gray-300 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center">
            <Hash size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={tags.length === 0 ? "Add tags to help readers find your article..." : "Add another tag..."}
              className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
              disabled={tags.length >= 10}
            />
          </div>
          {inputValue.trim() && (
            <button type="button" onClick={addTag} className="p-1.5 text-gray-400 hover:text-black transition-colors">
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {["Technology", "Programming", "Tutorial", "Tips", "Guide"].map(
          (suggestion) =>
            !tags.includes(suggestion) &&
            tags.length < 10 && (
              <button
                key={suggestion}
                type="button"
                onClick={() => onTagsChange([...tags, suggestion])}
                className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                + {suggestion}
              </button>
            ),
        )}
      </div>
    </div>
  )
}
