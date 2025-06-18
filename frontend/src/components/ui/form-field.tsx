import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-semibold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 focus:border-black transition-all duration-200 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      />
      {error && (
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
