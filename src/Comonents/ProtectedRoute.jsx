import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";


export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // you can replace with a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
