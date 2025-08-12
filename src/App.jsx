import { Route, Router, Routes } from 'react-router'
import './App.css'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Loader from './Comonents/Loader'
import LandingPage from './Pages/LandingPage'
import Whiteboard from "./pages/Whiteboard";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from './Pages/Dashboard'
import ProtectedRoute from './Comonents/ProtectedRoute'



const ComponentWrapper = () => {
    return(
      <>

     <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<Register />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="whiteboard/:roomId"
          element={
            <ProtectedRoute>
              <Whiteboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
      </>
    )
}



function App({ DOMLoaded }) {
  return (
    <>
      {DOMLoaded ? <ComponentWrapper/> : <Loader />}
    </>
  )
}

export default App