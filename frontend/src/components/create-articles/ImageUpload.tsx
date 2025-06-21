"use client"

import React, { useState, useRef, useCallback } from "react"
import { X, ImageIcon, Camera } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  error?: string
  currentImage?: File | null
  existingImageUrl?: string | null
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, error, currentImage, existingImageUrl }) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (currentImage) {
      const url = URL.createObjectURL(currentImage)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (existingImageUrl) {
      setPreview(existingImageUrl)
    } else {
      setPreview(null)
    }
  }, [currentImage, existingImageUrl])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      onImageSelect(file)
    } else {
      alert("Please select an image file")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeImage = () => {
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">Article Cover Image</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-64 sm:h-80 object-cover rounded-2xl border-2 border-gray-100"
          />
          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-2xl flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 bg-white text-gray-700 rounded-full hover:bg-gray-100 shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
          {existingImageUrl && !currentImage && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                Current Image
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? "border-black bg-gray-50 scale-[1.02]"
              : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`p-6 rounded-full ${error ? "bg-red-100" : "bg-gray-100"}`}>
                {error ? <ImageIcon className="w-8 h-8 text-red-500" /> : <Camera className="w-8 h-8 text-gray-600" />}
              </div>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your image here, or{" "}
                <span className="text-black hover:underline cursor-pointer font-semibold">browse</span>
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB • Recommended: 1200x630px</p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  )
}
