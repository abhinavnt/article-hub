import type { User, UserUpdateData, PasswordChangeData } from "@/types/user"

export const userService = {
  // Update user profile
  updateProfile: async (userId: string, userData: UserUpdateData): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API call
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve({
            userId,
            firstName: userData.firstName || "John",
            lastName: userData.lastName || "Doe",
            email: userData.email || "john@example.com",
            phone: userData.phone || "+1234567890",
            dateOfBirth: userData.dateOfBirth || new Date("1990-01-01"),
            articlePreferences: userData.articlePreferences || ["Technology"],
            profileImageUrl: "/placeholder.svg?height=100&width=100",
            role: "user",
            status: "active",
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date(),
          } as User)
        } else {
          reject(new Error("Failed to update profile"))
        }
      }, 1000)
    })
  },

  // Change password
  changePassword: async (userId: string, passwordData: PasswordChangeData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          reject(new Error("Passwords do not match"))
          return
        }
        if (passwordData.newPassword.length < 6) {
          reject(new Error("Password must be at least 6 characters"))
          return
        }
        // Simulate API call
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve()
        } else {
          reject(new Error("Failed to change password"))
        }
      }, 800)
    })
  },

  // Get available preferences/categories
  getAvailablePreferences: async (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "Technology",
          "Health",
          "Travel",
          "Food",
          "Finance",
          "Sports",
          "Education",
          "Entertainment",
          "Science",
          "Art",
        ])
      }, 300)
    })
  },

   uploadProfileImage: async (userId: string, file: File) => URL.createObjectURL(file),
}
