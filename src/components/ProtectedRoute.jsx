import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Usage in App.jsx:
// <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;