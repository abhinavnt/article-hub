import type React from "react"
import { Label } from "@/components/ui/label"

interface Option {
  id: string
  label: string
}

interface PreferenceButtonsProps {
  label: string
  options: Option[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  error?: string
  required?: boolean
}

export const PreferenceButtons: React.FC<PreferenceButtonsProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  required = false,
}) => {
  const handleButtonClick = (optionId: string) => {
    if (selectedValues.includes(optionId)) {
      onChange(selectedValues.filter((id) => id !== optionId))
    } else {
      onChange([...selectedValues, optionId])
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleButtonClick(option.id)}
            className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border-2 text-center min-h-[44px] flex items-center justify-center ${
              selectedValues.includes(option.id)
                ? "bg-black text-white border-black shadow-lg transform scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-md hover:transform hover:scale-102"
            }`}
          >
            <span className="leading-tight">{option.label}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  )
}
