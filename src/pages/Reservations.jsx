import React, { useState } from "react";
import {
  QrCode,
  Clock3,
  MapPinned,
  CalendarDays,
  Clock,
  Car,
  ShieldCheck,
  Navigation,
  Download,
  BadgeCheck,
} from "lucide-react";

/**
 * Reservations — web layout, tabbed Active / Upcoming / History.
 * Swap the mock arrays for BookingSlice state, e.g.:
 *   const { active, upcoming, history } = useSelector(s => s.bookings);
 *
 * Your existing ReservationDetails.jsx presumably handles the single-
 * reservation drill-down — this page is the list/overview.
 */
const mockActive = {
  lot: "Downtown Central",
  provider: "Park N' Fly • Space S1",
  bay: "Level 2 • Space #42",
  date: "Today, May 24, 2025",
  window: "10:00 AM – 1:30 PM (3.5 hrs)",
  vehicle: "Tesla Model 3 • 7ABC123",
  total: "18.50",
  gate: "Gate B Entrance (Southbound)",
  eta: "12 min",
};

const mockUpcoming = [
  {
    id: "u1",
    lot: "Riverside Plaza Garage",
    date: "Tomorrow • May 25",
    window: "2:00 PM – 4:30 PM",
    vehicle: "Tesla Model 3 • 7ABC123",
    price: "7.00",
    status: "Prepaid",
    cancelNote: "Free Cancellation",
  },
  {
    id: "u2",
    lot: "Metro EV Terminal Park",
    date: "Sat • Jun 01",
    window: "8:00 AM – 6:00 PM",
    vehicle: null,
    price: "24.00",
    status: "Reserved",
  },
];

const mockHistory = [
  { id: "h1", lot: "City Center Lot A", date: "Apr 29, 2024 • 9:00 AM", duration: "3 hr 20 min", price: "15.75" },
  { id: "h2", lot: "Beachside Parking Lot", date: "Apr 22, 2024 • 4:45 PM", duration: "1 hr 15 min", price: "6.25" },
  { id: "h3", lot: "Harbor View Garage", date: "Apr 10, 2024 • 11:20 AM", duration: "4 hr 10 min", price: "21.00" },
];

const HISTORY_RANGES = ["This Month", "Last 3 Months", "2024", "All"];

export default function Reservations() {
  const [tab, setTab] = useState("active");
  const [historyRange, setHistoryRange] = useState("This Month");

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Reservations</h1>
      <p className="dashboard-subtitle">Track active sessions, upcoming visits, and past receipts</p>

      <div className="reservation-tabs">
        <button
          className={`reservation-tab${tab === "active" ? " active" : ""}`}
          onClick={() => setTab("active")}
        >
          Active <span className="reservation-tab-count">1</span>
        </button>
        <button
          className={`reservation-tab${tab === "upcoming" ? " active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming <span className="reservation-tab-count">{mockUpcoming.length}</span>
        </button>
        <button
          className={`reservation-tab${tab === "history" ? " active" : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      {tab === "active" && <ActivePanel booking={mockActive} />}
      {tab === "upcoming" && <UpcomingPanel bookings={mockUpcoming} />}
      {tab === "history" && (
        <HistoryPanel bookings={mockHistory} range={historyRange} onRangeChange={setHistoryRange} />
      )}

      <div className="policy-banner">
        <ShieldCheck size={18} style={{ flexShrink: 0, color: "var(--color-teal-600)" }} />
        <div>
          <strong>Guaranteed Reservation Policy</strong>
          Need to cancel? Cancel up to 30 minutes prior to entry time for a 100% immediate refund.
        </div>
      </div>
    </div>
  );
}

function ActivePanel({ booking }) {
  return (
    <div className="reservation-card">
      <div className="reservation-card-header">
        <p className="parking-card-name">{booking.lot}</p>
        <span className="slots-badge">
          <BadgeCheck size={12} style={{ verticalAlign: "-1px" }} /> Verified
        </span>
      </div>
      <p className="parking-card-address">{booking.provider}</p>

      <div className="reservation-bay-box">
        <p className="parking-card-address">Assigned Bay</p>
        <p className="parking-card-name">{booking.bay}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="reservation-detail-row">
          <CalendarDays size={14} /> Date <span className="reservation-detail-value">{booking.date}</span>
        </div>
        <div className="reservation-detail-row">
          <Clock size={14} /> Time Window <span className="reservation-detail-value">{booking.window}</span>
        </div>
        <div className="reservation-detail-row">
          <Car size={14} /> Vehicle <span className="reservation-detail-value">{booking.vehicle}</span>
        </div>
      </div>

      <div className="reservation-total-row">
        <span className="parking-card-address">Total Paid</span>
        <span className="reservation-total-value">${booking.total}</span>
      </div>

      <div className="reservation-actions">
        <button className="btn btn-teal btn-block">
          <QrCode size={16} /> Show Parking Pass QR
        </button>
      </div>
      <div className="reservation-actions">
        <button className="btn btn-outline">
          <Clock3 size={15} /> Extend Time
        </button>
        <button className="btn btn-outline">
          <MapPinned size={15} /> Directions
        </button>
      </div>

      <div className="dashboard-section-header" style={{ marginTop: 20 }}>
        <h2 className="dashboard-section-title">Garage Wayfinding</h2>
        <span className="dashboard-view-all">Clear Gate in {booking.eta}</span>
      </div>
      <div className="wayfinding-panel">
        <div className="wayfinding-icon"><Navigation size={20} /></div>
        <p className="parking-card-address">{booking.gate}</p>
        <span className="dashboard-view-all" style={{ cursor: "pointer" }}>Open Map</span>
      </div>
    </div>
  );
}

function UpcomingPanel({ bookings }) {
  return (
    <div>
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Next Scheduled Visits</h2>
        <span className="parking-card-address">{bookings.length} Reservations</span>
      </div>

      <div className="dashboard-bookings-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {bookings.map((b) => (
          <div className="reservation-card" key={b.id}>
            <div className="reservation-card-header">
              <span className="parking-card-address">{b.date} · {b.window}</span>
              <div className="parking-card-price">
                ${b.price}
                <span> {b.status}</span>
              </div>
            </div>
            <div className="active-session-body" style={{ marginTop: 8 }}>
              <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
                <Car size={16} />
              </div>
              <div>
                <p className="parking-card-name">{b.lot}</p>
                {b.vehicle && <p className="parking-card-address">{b.vehicle}</p>}
              </div>
            </div>
            {b.cancelNote && <p className="reservation-free-cancel">{b.cancelNote}</p>}
            <div className="reservation-actions">
              <button className="btn btn-teal">View Details</button>
              <button className="btn btn-outline">Modify</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPanel({ bookings, range, onRangeChange }) {
  return (
    <div>
      <div className="filter-bar" style={{ padding: 0, marginBottom: 16 }}>
        {HISTORY_RANGES.map((r) => (
          <button
            key={r}
            className={`filter-pill${range === r ? " active" : ""}`}
            onClick={() => onRangeChange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="dashboard-bookings-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {bookings.map((b) => (
          <div className="reservation-card" key={b.id}>
            <div className="active-session-body">
              <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
                <Car size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="parking-card-name">{b.lot}</p>
                <p className="parking-card-address">{b.date} · {b.duration}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="parking-card-name">${b.price}</p>
                <p className="reservation-status-completed">Completed</p>
              </div>
            </div>
            <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}>
              <Download size={14} /> Download Receipt (PDF)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}