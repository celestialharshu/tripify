import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// wraps pages that should only be visible to logged in users
// e.g. <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
