"use client"

import type React from "react"
import { useState } from "react"
import { Camera, User } from "lucide-react"

import { ImageUploadModal } from "./ImageUploadModal"
import { Card } from "../ui/CustomCard"

interface ProfilePhotoSectionProps {
  profileImage?: string
  onImageUpdate: (file: File) => void
  loading?: boolean
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  profileImage,
  onImageUpdate,
  loading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer hover:border-blue-300 transition-colors group ${
                loading ? "opacity-50" : ""
              }`}
              onClick={() => !loading && setIsModalOpen(true)}
            >
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={() => !loading && setIsModalOpen(true)}
              disabled={loading}
              className={`absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Camera className="w-4 h-4" />
            </button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-600 mt-1">Click on your photo to update it. Recommended size: 400x400px</p>
            <button
              onClick={() => !loading && setIsModalOpen(true)}
              disabled={loading}
              className={`mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium underline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Uploading..." : "Change Photo"}
            </button>
          </div>
        </div>
      </Card>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImage={profileImage}
        onImageUpload={onImageUpdate}
      />
    </>
  )
}
