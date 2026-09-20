import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings } from "../Reducer/BookingSlice";
import { toast } from "react-toastify";
import {
  Navigation2,
  Car,
  BadgePercent,
  KeyRound,
  Clock3,
  ArrowRight,
  Bookmark,
  CalendarCheck,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((s) => s?.auth?.user);
  const { bookings, loading } = useSelector((s) => s?.booking || { bookings: [] });

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const userName = user?.fullName || user?.name || user?.email?.split("@")[0] || "Driver";
  const userRole = user?.role ? user.role.toUpperCase() : "DRIVER";

  const handleFindParking = () => {
    if ("geolocation" in navigator) {
      toast.info("Fetching your location...", { autoClose: 2000 });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          toast.success("Location fetched successfully!");
          navigate("/search", { state: { lat, lng } });
        },
        (error) => {
          console.error("Error getting location: ", error);
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Location access denied. Please allow location access in your browser.");
          } else {
            toast.error("Failed to fetch location. Please try again.");
          }
          navigate("/search");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      navigate("/search");
    }
  };

  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter((b) => b.status === "active") || [];
  const activeSession = activeBookings[0] || null;
  const activeCount = activeBookings.length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-topline">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {userName} <span className="tier-badge">{userRole}</span>
          </h1>
          <p className="dashboard-subtitle">Find quick parking or manage your active bookings</p>
        </div>
        <button className="btn btn-teal" onClick={handleFindParking}>
          <Navigation2 size={16} /> Find Parking
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-card-label">Total Bookings</p>
          <p className="stat-card-value">{totalBookings}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Active Sessions</p>
          <p className={`stat-card-value ${activeCount > 0 ? "active" : ""}`}>
            {activeCount}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Saved Lots</p>
          <p className="stat-card-value">0</p>
        </div>
      </div>

      {/* Active Session Card or Clean Empty State */}
      {activeSession ? (
        <div className="active-session-card">
          <div className="active-session-header">
            <span className="slots-badge">● Active Now</span>
            <span className="parking-card-address">
              {activeSession.slot?.slotNumber
                ? `Slot ${activeSession.slot.slotNumber}`
                : "Reserved Bay"}
            </span>
          </div>

          <div className="active-session-body">
            <div className="active-session-thumb">
              <Car size={22} />
            </div>
            <div>
              <p className="parking-card-name">
                {activeSession.parking?.parkingName || "Reserved Garage"}
              </p>
              <p className="parking-card-address">
                {activeSession.vehicleName
                  ? `${activeSession.vehicleName} ${activeSession.vehicleModel || ""} (${activeSession.plateNumber})`
                  : "Vehicle details recorded"}
              </p>
            </div>
            <div className="active-session-time">
              <span className="parking-card-address">Duration</span>
              <p className="active-session-remaining">
                {activeSession.hours || 1} {activeSession.hours === 1 ? "Hour" : "Hours"}
              </p>
            </div>
          </div>

          <div className="active-session-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigate(`/reservations/${activeSession._id}`)}
            >
              <KeyRound size={15} /> View Pass
            </button>
            <button className="btn btn-teal" onClick={() => navigate("/reservations")}>
              All Bookings
            </button>
          </div>
        </div>
      ) : (
        <div
          className="active-session-card"
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-gray-200)",
            padding: "24px 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                className="active-session-thumb"
                style={{
                  background: "var(--color-teal-100)",
                  color: "var(--color-teal-700)",
                  width: 48,
                  height: 48,
                }}
              >
                <Car size={24} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>
                  No Active Parking Sessions
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-gray-600)" }}>
                  You haven't reserved any parking spots yet. Find a spot near your destination.
                </p>
              </div>
            </div>
            <button className="btn btn-teal" onClick={handleFindParking}>
              <Navigation2 size={15} /> Find Parking
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Quick Actions</h2>
      </div>
      <div className="quick-actions-grid">
        <div className="quick-action-tile" onClick={handleFindParking}>
          <div className="quick-action-icon">
            <Navigation2 size={18} />
          </div>
          <div>
            <p className="quick-action-title">Find Parking</p>
            <p className="quick-action-sub">Nearby spots &amp; live slots</p>
          </div>
        </div>

        <div className="quick-action-tile" onClick={() => navigate("/reservations")}>
          <div className="quick-action-icon">
            <CalendarCheck size={18} />
          </div>
          <div>
            <p className="quick-action-title">My Bookings</p>
            <p className="quick-action-sub">
              {totalBookings === 0 ? "No active passes" : `${totalBookings} reservation(s)`}
            </p>
          </div>
        </div>

        <div className="quick-action-tile" onClick={() => navigate("/search")}>
          <div className="quick-action-icon">
            <Bookmark size={18} />
          </div>
          <div>
            <p className="quick-action-title">Explore Lots</p>
            <p className="quick-action-sub">Compare rates &amp; bays</p>
          </div>
        </div>

        <div
          className="quick-action-tile"
          onClick={() => toast.info("24/7 ParkEase Support is active. Email: support@parkease.com")}
        >
          <div className="quick-action-icon">
            <HelpCircle size={18} />
          </div>
          <div>
            <p className="quick-action-title">Help &amp; Support</p>
            <p className="quick-action-sub">24/7 Driver assistance</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Recent Bookings</h2>
        {totalBookings > 0 && (
          <span
            className="dashboard-view-all"
            onClick={() => navigate("/reservations")}
            style={{ cursor: "pointer" }}
          >
            View All <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
          </span>
        )}
      </div>

      {totalBookings > 0 ? (
        <div className="dashboard-bookings-grid">
          {bookings.slice(0, 4).map((b) => (
            <div
              className="booking-row"
              key={b._id}
              onClick={() => navigate(`/reservations/${b._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
                <Car size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="parking-card-name">
                  {b.parking?.parkingName || "Parking Location"}
                </p>
                <p className="parking-card-address">
                  {new Date(b.createdAt || b.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {b.vehicleName ? ` · ${b.vehicleName} (${b.plateNumber || ""})` : ""}
                </p>
              </div>
              <p className="booking-row-price" style={{ color: "var(--color-teal-600)", fontWeight: 700 }}>
                ${b.totalPrice ? Number(b.totalPrice).toFixed(2) : "0.00"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "36px 24px",
            textAlign: "center",
            background: "var(--color-white)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-gray-200)",
            color: "var(--color-gray-600)",
          }}
        >
          <Car size={28} color="var(--color-gray-400)" style={{ margin: "0 auto 8px" }} />
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "var(--color-charcoal)" }}>
            No recent bookings yet
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>
            When you reserve a parking spot, your active passes and booking receipts will appear here.
          </p>
        </div>
      )}
    </div>
  );
}