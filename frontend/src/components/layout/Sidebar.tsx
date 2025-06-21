
import { clearUser } from "@/redux/features/AuthSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/CustomButton"

export const Sidebar: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        dispatch(clearUser())
        navigate("/register")
    }

    const navItems = [
        {
            key: "feed",
            path: "/feed",
            label: "Dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                    />
                </svg>
            ),
        },
        {
            key: "my-articles",
            path: "/my-articles",
            label: "My Articles",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            key: "create-article",
            path: "/create-article",
            label: "Create Article",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
        },
        {
            key: "settings",
            path: "/settings",
            label: "Settings",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ]

    const isCurrentPath = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto shadow-sm">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-xl font-bold text-black">ArticleHub</h1>
                </div>

                {/* User Profile */}
                <div className="mt-8 flex-shrink-0 flex border-t border-gray-200 p-4">
                    <div className="flex-shrink-0 w-full group block">
                        <div className="flex items-center">
                            <div>
                                <img
                                    className="inline-block h-10 w-10 rounded-full"
                                    src={user?.profileImageUrl || "/placeholder.svg?height=40&width=40"}
                                    alt="Profile"
                                />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-5  flex-1 px-2 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
                            className={`group cursor-pointer flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${isCurrentPath(item.path) ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <span
                                className={`mr-3 flex-shrink-0 h-5 w-5 ${isCurrentPath(item.path) ? "text-white" : "text-gray-400 group-hover:text-gray-500"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}
