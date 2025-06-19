
import { ArticlePreferencesSection } from "@/components/settings/ArticlePreferencesSection"
import { PasswordChangeSection } from "@/components/settings/PasswordChangeSection"
import { ProfileInformationSection } from "@/components/settings/ProfileInformationSection"
import { ProfilePhotoSection } from "@/components/settings/ProfilePhotoSection"
import { Loading } from "@/components/ui/Loading"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { userService } from "@/services/userService"
import type { UserUpdateData } from "@/types/user"
import type React from "react"
import { useState, useEffect, useMemo } from "react"

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}




const updateUser = (payload: any) => ({ type: "UPDATE_USER", payload })



export const Settings: React.FC = () => {
  const { user } = useAppSelector((state: any) => state.auth)
  const dispatch = useAppDispatch()

  const [profileData, setProfileData] = useState<UserUpdateData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || new Date(),
    articlePreferences: user?.articlePreferences || [],
    profileImage: user?.profileImage || "",
  })



  const [availablePreferences, setAvailablePreferences] = useState<string[]>([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [preferencesLoading, setPreferencesLoading] = useState(true)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  // Add state to track initial values for comparison
  const [initialProfileData, setInitialProfileData] = useState<UserUpdateData>({})
  const [initialPreferences, setInitialPreferences] = useState<string[]>([])

  useEffect(() => {
    loadPreferences()
  }, [])

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || new Date(),
        articlePreferences: user.articlePreferences || [],
        profileImage: user.profileImage || "",
      }
      setProfileData(userData)
      setInitialProfileData(userData)
      setInitialPreferences(user.articlePreferences || [])
    }
  }, [user])

  const loadPreferences = async () => {
    try {
      const preferences = await userService.getAvailablePreferences()
      setAvailablePreferences(preferences)
    } catch (error) {
      console.error("Failed to load preferences:", error)
    } finally {
      setPreferencesLoading(false)
    }
  }

  const handleImageUpdate = async (file: File) => {
    if (!user) return

    setImageUploadLoading(true)
    try {
      const imageUrl = await userService.uploadProfileImage(user.userId, file)

      const updatedProfileData = { ...profileData, profileImage: imageUrl }
      setProfileData(updatedProfileData)

      // Update user in Redux store
      const updatedUser = await userService.updateProfile(user.userId, updatedProfileData)
      dispatch(updateUser({ user: updatedUser }))

      alert("Profile photo updated successfully!")
    } catch (error) {
      console.error("Failed to update profile photo:", error)
      alert("Failed to update profile photo. Please try again.")
    } finally {
      setImageUploadLoading(false)
    }
  }

  // Check if profile image has changed
  const hasImageChanged = useMemo(() => {
    return profileData.profileImage !== initialProfileData.profileImage
  }, [profileData.profileImage, initialProfileData.profileImage])

  const handleProfileSubmit = async (formData: any) => {
    if (!user) return

    setProfileLoading(true)
    try {
      const updatedProfileData = {
        ...profileData,
        ...formData,
        dateOfBirth: typeof formData.dateOfBirth === "string" ? new Date(formData.dateOfBirth) : formData.dateOfBirth,
        // Include profile image only if it has changed
        ...(hasImageChanged && { profileImage: profileData.profileImage }),
      }

      const updatedUser = await userService.updateProfile(user.userId, updatedProfileData)
      dispatch(updateUser({ user: updatedUser }))

      // Update initial data after successful update
      setInitialProfileData(updatedProfileData)
      setProfileData(updatedProfileData)

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePreferenceToggle = (preference: string) => {
    const currentPreferences = profileData.articlePreferences || []
    const updatedPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter((p) => p !== preference)
      : [...currentPreferences, preference]

    setProfileData((prev) => ({ ...prev, articlePreferences: updatedPreferences }))
  }

  const handlePreferencesSubmit = async () => {
    if (!user) return

    setProfileLoading(true)
    try {
      const updatedUser = await userService.updateProfile(user.userId, {
        articlePreferences: profileData.articlePreferences,
      })
      dispatch(updateUser({ user: updatedUser }))

      // Update initial preferences after successful update
      setInitialPreferences(profileData.articlePreferences || [])

      alert("Preferences updated successfully!")
    } catch (error) {
      console.error("Failed to update preferences:", error)
      alert("Failed to update preferences. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (passwordFormData: PasswordChangeData) => {
    if (!user) return

    setPasswordLoading(true)
    try {
      await userService.changePassword(user.userId, passwordFormData)
      alert("Password changed successfully!")
    } catch (error: any) {
      console.error("Failed to change password:", error)
      alert(error.message || "Failed to change password. Please try again.")
    } finally {
      setPasswordLoading(false)
    }
  }

  if (preferencesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Profile Photo Section */}
          <ProfilePhotoSection
            profileImage={profileData.profileImage}
            onImageUpdate={handleImageUpdate}
            loading={imageUploadLoading}
          />

          {/* Profile Information Section */}
          <ProfileInformationSection
            initialData={{
              firstName: profileData.firstName || "",
              lastName: profileData.lastName || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
              dateOfBirth: profileData.dateOfBirth
                ? typeof profileData.dateOfBirth === "string"
                  ? profileData.dateOfBirth
                  : profileData.dateOfBirth.toISOString().split("T")[0]
                : "",
            }}
            onSubmit={handleProfileSubmit}
            loading={profileLoading}
          />

          {/* Article Preferences Section */}
          <ArticlePreferencesSection
            availablePreferences={availablePreferences}
            selectedPreferences={profileData.articlePreferences || []}
            initialPreferences={initialPreferences}
            onPreferenceToggle={handlePreferenceToggle}
            onSubmit={handlePreferencesSubmit}
            loading={profileLoading}
          />

          {/* Password Change Section */}
          <PasswordChangeSection onSubmit={handlePasswordSubmit} loading={passwordLoading} />
        </div>
      </div>
    </div>
  )
}
