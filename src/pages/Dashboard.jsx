import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Navigation2,
  Car,
  BadgePercent,
  KeyRound,
  Clock3,
  ArrowRight,
} from "lucide-react";

/**
 * Home Dashboard — web layout.
 * Assumes <Navbar /> is already rendered by your app shell (e.g. in
 * App.jsx / a layout route), so this component only renders the page body.
 *
 * Replace the `mock*` values with real state, e.g.:
 *   const user = useSelector((s) => s.auth.user);
 *   const stats = useSelector((s) => s.booking.stats);
 */
export default function Dashboard() {
  const navigate = useNavigate();

  const user = useSelector((s) => s?.auth?.user) || { name: "Sebastian", tier: "Gold Tier" };

  const stats = { total: 14, active: 1, saved: 4 };

  const activeSession = {
    lot: "Downtown Central Garage",
    vehicle: "Honda Civic (7ABC123)",
    bay: "Bay 4B • Floor 2",
    remaining: "1h 39m 02s",
    progressPct: 68,
  };

  const recentBookings = [
    { id: "1", lot: "Riverside Plaza Parking", date: "May 24, 2025", price: "$7.00" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-topline">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user.name} <span className="tier-badge">{user.tier}</span>
          </h1>
          <p className="dashboard-subtitle">Find quick parking or view active sessions</p>
        </div>
        <button className="btn btn-teal" onClick={() => navigate("/search-parking")}>
          <Navigation2 size={16} /> Find Parking
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-card-label">Total Bookings</p>
          <p className="stat-card-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Active Sessions</p>
          <p className="stat-card-value active">{stats.active}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Saved Lots</p>
          <p className="stat-card-value">{stats.saved}</p>
        </div>
      </div>

      <div className="active-session-card">
        <div className="active-session-header">
          <span className="slots-badge">● Active Now</span>
          <span className="parking-card-address">{activeSession.bay}</span>
        </div>

        <div className="active-session-body">
          <div className="active-session-thumb">
            <Car size={22} />
          </div>
          <div>
            <p className="parking-card-name">{activeSession.lot}</p>
            <p className="parking-card-address">{activeSession.vehicle}</p>
          </div>
          <div className="active-session-time">
            <span className="parking-card-address">Remaining</span>
            <p className="active-session-remaining">{activeSession.remaining}</p>
          </div>
        </div>

        <div className="session-progress-track">
          <div className="session-progress-fill" style={{ width: `${activeSession.progressPct}%` }} />
        </div>

        <div className="active-session-actions">
          <button className="btn btn-outline">
            <Clock3 size={15} /> Extend Time
          </button>
          <button className="btn btn-teal">
            <KeyRound size={15} /> Access Key
          </button>
        </div>
      </div>

      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Quick Actions</h2>
      </div>
      <div className="quick-actions-grid">
        <div className="quick-action-tile" onClick={() => navigate("/search-parking")}>
          <div className="quick-action-icon"><Navigation2 size={18} /></div>
          <div>
            <p className="quick-action-title">Find Parking</p>
            <p className="quick-action-sub">Nearby spots &amp; EV</p>
          </div>
        </div>
        <div className="quick-action-tile" onClick={() => navigate("/vehicles")}>
          <div className="quick-action-icon"><Car size={18} /></div>
          <div>
            <p className="quick-action-title">My Vehicles</p>
            <p className="quick-action-sub">Civic • 7ABC123</p>
          </div>
        </div>
        <div className="quick-action-tile">
          <div className="quick-action-icon"><BadgePercent size={18} /></div>
          <div>
            <p className="quick-action-title">Monthly Pass</p>
            <p className="quick-action-sub">Save up to 35%</p>
          </div>
        </div>
        <div className="quick-action-tile">
          <div className="quick-action-icon"><KeyRound size={18} /></div>
          <div>
            <p className="quick-action-title">Valet Drop-off</p>
            <p className="quick-action-sub">Curbside handoff</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Recent Bookings</h2>
        <span className="dashboard-view-all" onClick={() => navigate("/reservations")} style={{ cursor: "pointer" }}>
          View All <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
        </span>
      </div>
      <div className="dashboard-bookings-grid">
        {recentBookings.map((b) => (
          <div className="booking-row" key={b.id}>
            <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
              <Car size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <p className="parking-card-name">{b.lot}</p>
              <p className="parking-card-address">{b.date}</p>
            </div>
            <p className="booking-row-price">{b.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}