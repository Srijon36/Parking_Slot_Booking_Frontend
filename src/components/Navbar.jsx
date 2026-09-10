import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Reducer/AuthSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo">P</span>
          ParkEase
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
            Find Parking
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
            Bookings
          </NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          <NavLink to="/search" className="btn btn-teal">
            Find Parking
          </NavLink>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="navbar-avatar" title={user?.fullName}>
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </button>
          ) : (
            <NavLink to="/login" className="navbar-avatar">
              👤
            </NavLink>
          )}

          <button className="navbar-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;