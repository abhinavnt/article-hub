import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../ui/form-field"
import { PreferenceButtons } from "../ui/preference-buttons"
import { Loader2, UserPlus } from "lucide-react"
import {
  validateEmail,
  validateIndianPhone,
  validatePassword,
  validateName,
  validateDateOfBirth,
  validatePasswordConfirmation,
} from "../../utils/validation"
import { registerUser, type RegisterData } from "@/services/authService"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCategories } from "@/services/AddArticleService"

interface FormErrors {
  [key: string]: string
}

interface RegistrationFormProps {
  onSwitchToLogin: () => void
}

interface Category {
  id: string // Original _id from backend
  name: string
  createdAt: string
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
    passwordConfirmation: "",
    articlePreferences: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isFetchingCategories, setIsFetchingCategories] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Fetch categories and add the new id field with uppercase name
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        // Transform the data to include a new id field with uppercase name
        const transformedData = data.map((cat: Category) => ({
          ...cat,
          id: cat.name.toUpperCase(),
          originalId: cat.id, // Preserve original id as originalId
        }))
        setCategories(transformedData)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setFetchError("Failed to load categories. Please try again later.")
      } finally {
        setIsFetchingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Map categories to the required format, limit to 10, using the new id field
  const limitedCategories = categories.slice(0, 10).map((cat) => ({
    id: cat.id, // Use originalId for backend compatibility
    label: cat.id, // Display the new uppercase id field
  }))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error = ""

    switch (name) {
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
      case "password":
        error = validatePassword(value)
        if (formData.passwordConfirmation) {
          const confirmError = validatePasswordConfirmation(value, formData.passwordConfirmation)
          setErrors((prev) => ({ ...prev, passwordConfirmation: confirmError }))
        }
        break
      case "passwordConfirmation":
        error = validatePasswordConfirmation(formData.password, value)
        break
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handlePreferencesChange = (preferences: string[]) => {
    setFormData((prev) => ({ ...prev, articlePreferences: preferences }))
    if (errors.articlePreferences) {
      setErrors((prev) => ({ ...prev, articlePreferences: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.firstName = validateName(formData.firstName, "First name")
    newErrors.lastName = validateName(formData.lastName, "Last name")
    newErrors.email = validateEmail(formData.email)
    newErrors.phone = validateIndianPhone(formData.phone)
    newErrors.dateOfBirth = validateDateOfBirth(formData.dateOfBirth)
    newErrors.password = validatePassword(formData.password)
    newErrors.passwordConfirmation = validatePasswordConfirmation(
      formData.password,
      formData.passwordConfirmation
    )

    if (formData.articlePreferences.length === 0) {
      newErrors.articlePreferences = "Please select at least one article preference"
    }

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key]
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await registerUser(formData, dispatch)
      if (response.status === 400) {
        setErrorMessage(response.data.message)
        return
      }
      console.log(response)
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        password: "",
        passwordConfirmation: "",
        articlePreferences: [],
      })
      setErrors({})
      navigate("/feed")
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Join us today and personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 md:px-12 pb-8 sm:pb-12">
          {errorMessage && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-800 font-medium text-center">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.firstName}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.lastName}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="9876543210 or +91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.phone}
                required
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.email}
                required
              />
            </div>

            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.dateOfBirth}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.password}
                required
              />
              <FormField
                label="Confirm Password"
                name="passwordConfirmation"
                type="password"
                placeholder="Confirm your password"
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.passwordConfirmation}
                required
              />
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-2xl">
              {isFetchingCategories ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-gray-600">Loading categories...</p>
                </div>
              ) : fetchError ? (
                <div className="text-center py-4 text-red-600">{fetchError}</div>
              ) : (
                <PreferenceButtons
                  label="What interests you?"
                  options={limitedCategories}
                  selectedValues={formData.articlePreferences}
                  onChange={handlePreferencesChange}
                  error={errors.articlePreferences}
                  required
                />
              )}
            </div>

            {errors.submit && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-800 font-medium text-center">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Creating Your Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-black font-semibold hover:underline transition-all duration-200"
              >
                Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}