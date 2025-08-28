import { Route, Router, Routes } from 'react-router'
import './App.css'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Loader from './Comonents/Loader'
import { AuthProvider } from "./context/AuthContext";
import Dashboard from '../src/Pages/Dashboard';
import LandingPage from '../src/Pages/LandingPage';
import ProtectedRoute from './Comonents/ProtectedRoute';

import { Navigate } from 'react-router'


const ComponentWrapper = () => {
    return(
      <>

     <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<Register />} />

       <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/room/:roomId" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
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