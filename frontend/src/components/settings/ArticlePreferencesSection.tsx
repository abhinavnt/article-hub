import type React from "react"
import { useMemo } from "react"
import { Card } from "../ui/CustomCard"
import { Button } from "../ui/CustomButton"
import { PreferenceButtons } from "../ui/preference-buttons"

interface Option {
  id: string
  label: string
}

interface ArticlePreferencesSectionProps {
  availablePreferences: Option[]
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

  // Handle changes from PreferenceButtons
  const handlePreferenceChange = (newSelected: string[]) => {
    const added = newSelected.filter(p => !selectedPreferences.includes(p))
    const removed = selectedPreferences.filter(p => !newSelected.includes(p))
    added.forEach(p => onPreferenceToggle(p))
    removed.forEach(p => onPreferenceToggle(p))
  }

  
  return (
    <Card>
      <h2 className="text-xl font-semibold text-black mb-6">Article Preferences</h2>
      <p className="text-gray-600 mb-4">Select the topics you're interested in to personalize your article feed.</p>

      <PreferenceButtons
        label="Select your article preferences"
        options={availablePreferences}
        selectedValues={selectedPreferences}
        onChange={handlePreferenceChange}
        error={hasError ? "Please select at least one preference to personalize your experience" : undefined}
        required={true}
      />

      <div className="mt-6 flex justify-end">
        <Button onClick={onSubmit} loading={loading} disabled={!hasChanges || hasError || loading}>
          {loading ? "Updating..." : "Update Preferences"}
        </Button>
      </div>
    </Card>
  )
}