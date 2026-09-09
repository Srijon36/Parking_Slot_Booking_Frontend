import { Navigate } from "react-router-dom";

const AUTH_STORAGE_KEY = "parking_token";

const getAuthData = () => {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = getAuthData();
  const token = auth?.token || null;
  const role = auth?.user?.role || null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;