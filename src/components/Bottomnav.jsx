import React from "react";
import { LayoutGrid, Search, Ticket, Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Bottom tab bar shared by Home, Find Parking, Bookings, Vehicles.
 * Wire the routes up to whatever paths your router already uses —
 * defaults below match the routing conventions in the memory notes.
 */
const NAV_ITEMS = [
  { key: "home", label: "Home", icon: LayoutGrid, path: "/" },
  { key: "find", label: "Find", icon: Search, path: "/search" },
  { key: "bookings", label: "Bookings", icon: Ticket, path: "/bookings" },
  { key: "vehicles", label: "Vehicles", icon: Car, path: "/vehicles" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="pe-bottom-nav">
      {NAV_ITEMS.slice(0, 2).map((item) => (
        <NavButton key={item.key} item={item} navigate={navigate} location={location} />
      ))}

      {/* Center FAB always routes to Find Parking */}
      <button
        className="pe-nav-fab"
        onClick={() => navigate("/search")}
        aria-label="Find parking"
      >
        <Search size={22} />
      </button>

      {NAV_ITEMS.slice(2).map((item) => (
        <NavButton key={item.key} item={item} navigate={navigate} location={location} />
      ))}
    </nav>
  );
}

function NavButton({ item, navigate, location }) {
  const isActive = location.pathname === item.path;
  const Icon = item.icon;
  return (
    <button
      className={`pe-nav-item${isActive ? " pe-active" : ""}`}
      onClick={() => navigate(item.path)}
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </button>
  );
}