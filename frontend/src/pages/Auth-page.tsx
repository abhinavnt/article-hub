import { LoginForm } from "@/components/auth/Login-form"
import { RegistrationForm } from "@/components/auth/Registration-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export default function AuthPage() {
  const [currentView, setCurrentView] = useState<"login" | "register">("register")

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/feed");
    }
  }, [navigate]);

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
