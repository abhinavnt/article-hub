
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for large screens - ALWAYS VISIBLE */}
      <Sidebar />

      {/* Header for mobile screens - ALWAYS VISIBLE */}
      <Header />

      {/* Main content with proper spacing for sidebar */}
      <div className="lg:pl-64">
        <main className="py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
