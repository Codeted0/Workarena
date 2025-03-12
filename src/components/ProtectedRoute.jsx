import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get the logged-in user from context

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
