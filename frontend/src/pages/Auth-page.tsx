import { LoginForm } from "@/components/auth/Login-form"
import { RegistrationForm } from "@/components/auth/Registration-form"
import { useState } from "react"


export default function AuthPage() {
  const [currentView, setCurrentView] = useState<"login" | "register">("register")

  const switchView = () => {
    setCurrentView(currentView === "login" ? "register" : "login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {currentView === "login" ? (
        <LoginForm onSwitchToRegister={switchView} />
      ) : (
        <RegistrationForm onSwitchToLogin={switchView} />
      )}
    </div>
  )
}
