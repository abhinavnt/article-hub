
import type React from "react"
import { useState, useEffect } from "react"
import type { UserUpdateData, PasswordChangeData } from "@/types/user"
import { Loading } from "@/components/ui/Loading"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { userService } from "@/services/userService"
import { updateUser } from "@/redux/features/AuthSlice"
import { Card } from "@/components/ui/CustomCard"
import { Input } from "@/components/ui/CustomInput"
import { Button } from "@/components/ui/CustomButton"

export const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const [profileData, setProfileData] = useState<UserUpdateData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || new Date(),
    articlePreferences: user?.articlePreferences || [],
  })

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [availablePreferences, setAvailablePreferences] = useState<string[]>([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [preferencesLoading, setPreferencesLoading] = useState(true)
  const [profileErrors, setProfileErrors] = useState<Partial<UserUpdateData>>({})
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordChangeData>>({})

  useEffect(() => {
    loadPreferences()
  }, [])

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

  const handleProfileInputChange = (field: keyof UserUpdateData, value: string | Date | string[]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePasswordInputChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePreferenceToggle = (preference: string) => {
    const currentPreferences = profileData.articlePreferences || []
    const updatedPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter((p) => p !== preference)
      : [...currentPreferences, preference]

    handleProfileInputChange("articlePreferences", updatedPreferences)
  }

  const validateProfileForm = (): boolean => {
    const errors: Partial<UserUpdateData> = {}

    if (!profileData.firstName?.trim()) {
      errors.firstName = "First name is required"
    }
    if (!profileData.lastName?.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!profileData.email?.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Email is invalid"
    }
    if (!profileData.phone?.trim()) {
      errors.phone = "Phone number is required"
    }
    if (!profileData.articlePreferences?.length) {
      errors.articlePreferences = ["At least one preference is required"]
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = (): boolean => {
    const errors: Partial<PasswordChangeData> = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm() || !user) return

    setProfileLoading(true)
    try {
      const updatedUser = await userService.updateProfile(user.userId, profileData)
      dispatch(updateUser({ user: updatedUser }))
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm() || !user) return

    setPasswordLoading(true)
    try {
      await userService.changePassword(user.userId, passwordData)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-black mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileData.firstName || ""}
                onChange={(e) => handleProfileInputChange("firstName", e.target.value)}
                error={profileErrors.firstName}
                required
              />
              <Input
                label="Last Name"
                value={profileData.lastName || ""}
                onChange={(e) => handleProfileInputChange("lastName", e.target.value)}
                error={profileErrors.lastName}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={profileData.email || ""}
              onChange={(e) => handleProfileInputChange("email", e.target.value)}
              error={profileErrors.email}
              required
            />

            <Input
              label="Phone"
              type="tel"
              value={profileData.phone || ""}
              onChange={(e) => handleProfileInputChange("phone", e.target.value)}
              error={profileErrors.phone}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split("T")[0] : ""}
              onChange={(e) => handleProfileInputChange("dateOfBirth", new Date(e.target.value))}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={profileLoading}>
                {profileLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Article Preferences */}
        <Card>
          <h2 className="text-xl font-semibold text-black mb-6">Article Preferences</h2>
          <p className="text-gray-600 mb-4">Select the topics you're interested in to personalize your article feed.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availablePreferences.map((preference) => (
              <label
                key={preference}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={profileData.articlePreferences?.includes(preference) || false}
                  onChange={() => handlePreferenceToggle(preference)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">{preference}</span>
              </label>
            ))}
          </div>

          {profileErrors.articlePreferences && (
            <p className="mt-2 text-sm text-red-600">At least one preference is required</p>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleProfileSubmit} loading={profileLoading}>
              {profileLoading ? "Updating..." : "Update Preferences"}
            </Button>
          </div>
        </Card>

        {/* Password Change */}
        <Card>
          <h2 className="text-xl font-semibold text-black mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
              error={passwordErrors.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
              error={passwordErrors.newPassword}
              helperText="Password must be at least 6 characters long"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
              error={passwordErrors.confirmPassword}
              required
            />

            <div className="flex justify-end">
              <Button type="submit" loading={passwordLoading}>
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
