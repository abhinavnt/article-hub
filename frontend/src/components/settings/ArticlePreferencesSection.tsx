
import type React from "react"
import { useMemo } from "react"
import { Card } from "../ui/CustomCard"
import { Button } from "../ui/CustomButton"

interface ArticlePreferencesSectionProps {
  availablePreferences: string[]
  selectedPreferences: string[]
  initialPreferences?: string[]
  onPreferenceToggle: (preference: string) => void
  onSubmit: () => Promise<void>
  loading: boolean
}

export const ArticlePreferencesSection: React.FC<ArticlePreferencesSectionProps> = ({
  availablePreferences,
  selectedPreferences,
  initialPreferences = [],
  onPreferenceToggle,
  onSubmit,
  loading,
}) => {
  // Check if preferences have changed
  const hasChanges = useMemo(() => {
    if (selectedPreferences.length !== initialPreferences.length) return true
    return (
      selectedPreferences.some((pref) => !initialPreferences.includes(pref)) ||
      initialPreferences.some((pref) => !selectedPreferences.includes(pref))
    )
  }, [selectedPreferences, initialPreferences])

  const hasError = selectedPreferences.length === 0

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black mb-6">Article Preferences</h2>
      <p className="text-gray-600 mb-4">Select the topics you're interested in to personalize your article feed.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availablePreferences.map((preference) => (
          <label
            key={preference}
            className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedPreferences.includes(preference)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedPreferences.includes(preference)}
              onChange={() => onPreferenceToggle(preference)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">{preference}</span>
          </label>
        ))}
      </div>

      {hasError && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          Please select at least one preference to personalize your experience
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={onSubmit} loading={loading} disabled={!hasChanges || hasError || loading}>
          {loading ? "Updating..." : "Update Preferences"}
        </Button>
      </div>
    </Card>
  )
}
