import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import './App.css'
import AuthPage from "./pages/Auth-page";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AuthPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
