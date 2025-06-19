import { validatePassword, validatePasswordConfirmation } from "@/utils/validation"
import type React from "react"
import { useState } from "react"
import { Card } from "../ui/CustomCard"
import { Input } from "../ui/CustomInput"
import { Button } from "../ui/CustomButton"


interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordChangeSectionProps {
  onSubmit: (data: PasswordData) => Promise<void>
  loading: boolean
}

export const PasswordChangeSection: React.FC<PasswordChangeSectionProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<PasswordData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof PasswordData, boolean>>>({})

  const validateField = (field: keyof PasswordData, value: string) => {
    let error = ""

    switch (field) {
      case "currentPassword":
        error = value ? "" : "Current password is required"
        break
      case "newPassword":
        error = validatePassword(value)
        break
      case "confirmPassword":
        error = validatePasswordConfirmation(formData.newPassword, value)
        break
    }

    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (touched[field]) {
      validateField(field, value)
    }

    // Also validate confirm password when new password changes
    if (field === "newPassword" && touched.confirmPassword) {
      const confirmError = validatePasswordConfirmation(value, formData.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
    }
  }

  const handleBlur = (field: keyof PasswordData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key as keyof PasswordData] = true
        return acc
      },
      {} as Record<keyof PasswordData, boolean>,
    )
    setTouched(allTouched)

    // Validate all fields
    const validationResults = Object.keys(formData).map((key) =>
      validateField(key as keyof PasswordData, formData[key as keyof PasswordData]),
    )

    if (validationResults.every((result) => result)) {
      await onSubmit(formData)
      // Reset form on successful submission
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setTouched({})
      setErrors({})
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
          onBlur={() => handleBlur("currentPassword")}
          error={touched.currentPassword ? errors.currentPassword : ""}
          required
        />

        <Input
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          onBlur={() => handleBlur("newPassword")}
          error={touched.newPassword ? errors.newPassword : ""}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={touched.confirmPassword ? errors.confirmPassword : ""}
          required
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" loading={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
