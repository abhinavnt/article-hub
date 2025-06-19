import type React from "react"
import { useState, useRef } from "react"
import { X, Upload, Camera } from "lucide-react"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage?: string
  onImageUpload: (file: File) => void
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, currentImage, onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const validateImageFile = (file: File): string => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB"
    }

    return ""
  }

  const handleFile = (file: File) => {
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      onImageUpload(fileInputRef.current.files[0])
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 bg-opacity-50  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Profile Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Image */}
          {currentImage && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Current Photo</p>
              <img
                src={currentImage || "/placeholder.svg"}
                alt="Current profile"
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-200"
              />
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : error
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-gray-200"
                />
                <p className="text-sm text-gray-600">New photo preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your image here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Supports: JPEG, PNG, GIF, WebP (max 5MB)</p>
                </div>
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Choose File</span>
            </button>
            {preview && (
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
