import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SearchParking from "./pages/SearchParking";
import ParkingDetails from "./pages/ParkingDetails";
import AvailableSlots from "./pages/AvailableSlots";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import PaymentHistory from "./pages/PaymentHistory";
import Reservations from "./pages/Reservations";
import ReservationDetails from "./pages/ReservationDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const AppLayout = () => {
  const location = useLocation();

  // Exact paths where Navbar/Footer should be hidden
  const hideLayoutRoutes = ["/login", "/register", "/forgot-password"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/search" element={<SearchParking />} />
        <Route path="/parking/:id" element={<ParkingDetails />} />

        {/* Protected User Routes */}
        <Route
          path="/slots/:parkingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <AvailableSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:parkingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-history"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Reservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ReservationDetails />
            </ProtectedRoute>
          }
        />

        {/* Shared Protected Routes (any logged-in role) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;