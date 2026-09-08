import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/reservations", label: "My Reservations", icon: "📋" },
  { to: "/payment-history", label: "Payment History", icon: "💳" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const vendorLinks = [
  { to: "/vendor/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/vendor/parkings", label: "My Parkings", icon: "🅿️" },
  { to: "/vendor/bookings", label: "Bookings", icon: "📋" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/vendors", label: "Vendors", icon: "🏢" },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const links =
    user?.role === "admin" ? adminLinks : user?.role === "vendor" ? vendorLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full min-h-screen p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;