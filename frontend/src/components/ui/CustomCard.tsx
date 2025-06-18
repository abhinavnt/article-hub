import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export const Card: React.FC<CardProps> = ({ children, className = "", padding = "md" }) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}
