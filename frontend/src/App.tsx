import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import './App.css'
import AuthPage from "./pages/Auth-page";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Feed from "./pages/Feed";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AuthPage/>}/>

        <Route element={<ProtectedRoute/>}>
         <Route path="/feed" element={<Feed/>}/>
        </Route>


      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
