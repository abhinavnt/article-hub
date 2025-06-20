import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import './App.css'
import AuthPage from "./pages/Auth-page";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import Layout from "./components/layout/Layout";
import { useEffect, useState } from "react";
import { refreshToken } from "./services/authService";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./redux/store";
// import { MyArticles } from "./pages/MyArticles";
import { CreateArticle } from "./pages/CreateArticle";
// import { EditArticle } from "./pages/EditArticle";
import { Settings } from "./pages/Settings";


function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    const fetchUser = async () => {

      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get('auth');

      if (authStatus === 'success') {
        localStorage.setItem("isAuthenticated", "true");
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedAuth) {
        try {
          await refreshToken(dispatch);
        } catch (error) {
          console.error("Error during token refresh", error);
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<Dashboard />} />
              {/* <Route path="/my-articles" element={<MyArticles />} /> */}
              <Route path="/create-article" element={<CreateArticle />} />
              {/* <Route path="/edit-article/:id" element={<EditArticle />} /> */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
