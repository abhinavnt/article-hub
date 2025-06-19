
import { validateDateOfBirth, validateEmail, validateIndianPhone, validateName } from "@/utils/validation"
import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card } from "../ui/CustomCard"
import { Input } from "../ui/CustomInput"
import { Button } from "../ui/CustomButton"


interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}

interface ProfileInformationSectionProps {
  initialData: ProfileData
  onSubmit: (data: ProfileData) => Promise<void>
  loading: boolean
}

export const ProfileInformationSection: React.FC<ProfileInformationSectionProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [errors, setErrors] = useState<Partial<ProfileData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileData, boolean>>>({})

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return (
      formData.firstName !== initialData.firstName ||
      formData.lastName !== initialData.lastName ||
      formData.email !== initialData.email ||
      formData.phone !== initialData.phone ||
      formData.dateOfBirth !== initialData.dateOfBirth
    )
  }, [formData, initialData])

  const validateField = (field: keyof ProfileData, value: string) => {
    let error = ""

    switch (field) {
      case "firstName":
        error = validateName(value, "First name")
        break
      case "lastName":
        error = validateName(value, "Last name")
        break
      case "email":
        error = validateEmail(value)
        break
      case "phone":
        error = validateIndianPhone(value)
        break
      case "dateOfBirth":
        error = validateDateOfBirth(value)
        break
    }

    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: keyof ProfileData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const isFormValid = Object.values(errors).every((err) => !err)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key as keyof ProfileData] = true
        return acc
      },
      {} as Record<keyof ProfileData, boolean>,
    )
    setTouched(allTouched)

    // Validate all fields
    const validationResults = Object.keys(formData).map((key) =>
      validateField(key as keyof ProfileData, formData[key as keyof ProfileData]),
    )

    if (validationResults.every((result) => result)) {
      await onSubmit(formData)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black mb-6">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            error={touched.firstName ? errors.firstName : ""}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            error={touched.lastName ? errors.lastName : ""}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : ""}
          required
        />

        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          error={touched.phone ? errors.phone : ""}
          helperText="Enter 10-digit Indian mobile number"
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          onBlur={() => handleBlur("dateOfBirth")}
          error={touched.dateOfBirth ? errors.dateOfBirth : ""}
          required
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" loading={loading} disabled={!hasChanges || !isFormValid || loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
