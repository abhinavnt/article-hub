import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../ui/form-field"
import { Loader2, LogIn } from "lucide-react"
import { validateEmail, validateIndianPhone } from "../../utils/validation"
import { login, type LoginData } from "@/services/authService"
import { useDispatch } from "react-redux"

interface FormErrors {
    [key: string]: string
}

interface LoginFormProps {
    onSwitchToRegister: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState<LoginData>({
        identifier: "",
        password: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const dispatch = useDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let error = ""

        switch (name) {
            case "identifier":
                if (!value.trim()) {
                    error = "Email or phone number is required"
                } else {
                    // Check if it's an email or phone
                    const emailError = validateEmail(value)
                    const phoneError = validateIndianPhone(value)

                    // If both validations fail, it's invalid
                    if (emailError && phoneError) {
                        error = "Please enter a valid email address or Indian phone number"
                    }
                }
                break
            case "password":
                if (!value) {
                    error = "Password is required"
                }
                break
        }

        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.identifier.trim()) {
            newErrors.identifier = "Email or phone number is required"
        } else {
            const emailError = validateEmail(formData.identifier)
            const phoneError = validateIndianPhone(formData.identifier)

            if (emailError && phoneError) {
                newErrors.identifier = "Please enter a valid email address or Indian phone number"
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            const response = await login(formData, dispatch)
            console.log("Login successful:", response)
            // Handle successful login (redirect, update state, etc.)
        } catch (error: any) {
            setErrors({
                submit: error.response?.data?.message || "Login failed. Please check your credentials.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-12">
                    <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</CardTitle>
                    <CardDescription className="text-lg text-gray-600">Sign in to continue your journey</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Email or Phone Number"
                            name="identifier"
                            placeholder="Enter email or phone (9876543210)"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={errors.identifier}
                            required
                        />

                        <FormField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={errors.password}
                            required
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-3 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-600 font-medium">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-black hover:underline font-semibold">
                                Forgot password?
                            </button>
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
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
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-lg">
                            {"Don't have an account? "}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-black font-semibold hover:underline transition-all duration-200"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
