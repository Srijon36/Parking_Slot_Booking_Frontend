import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings, cancelBooking } from "../Reducer/BookingSlice";
import { toast } from "react-toastify";
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
  X,
  ExternalLink,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";

const HISTORY_RANGES = ["This Month", "Last 3 Months", "All"];

export default function Reservations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useSelector((s) => s.booking || { bookings: [] });

  const [tab, setTab] = useState("active");
  const [historyRange, setHistoryRange] = useState("This Month");
  const [qrBooking, setQrBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const activeBookings = bookings.filter((b) => b.status === "active");
  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || (b.status === "active" && b.startTime && new Date(b.startTime) > new Date())
  );
  const historyBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success("Reservation cancelled successfully");
      } catch (err) {
        toast.error(err || "Failed to cancel reservation");
      }
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">My Reservations</h1>
      <p className="dashboard-subtitle">
        Track your active passes, scheduled visits, and parking receipts
      </p>

      <div className="reservation-tabs">
        <button
          className={`reservation-tab${tab === "active" ? " active" : ""}`}
          onClick={() => setTab("active")}
        >
          Active{" "}
          <span className="reservation-tab-count">
            {activeBookings.length}
          </span>
        </button>
        <button
          className={`reservation-tab${tab === "upcoming" ? " active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming{" "}
          <span className="reservation-tab-count">
            {upcomingBookings.length}
          </span>
        </button>
        <button
          className={`reservation-tab${tab === "history" ? " active" : ""}`}
          onClick={() => setTab("history")}
        >
          History{" "}
          <span className="reservation-tab-count">
            {historyBookings.length}
          </span>
        </button>
      </div>

      {loading && bookings.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            gap: 12,
            color: "var(--color-gray-600)",
          }}
        >
          <Loader2 className="animate-spin" size={24} /> Loading your reservations...
        </div>
      ) : (
        <>
          {tab === "active" && (
            <ActiveSection
              bookings={activeBookings}
              onShowQr={(b) => setQrBooking(b)}
              onCancel={handleCancelBooking}
              onFindParking={() => navigate("/search")}
            />
          )}

          {tab === "upcoming" && (
            <UpcomingSection
              bookings={upcomingBookings}
              onCancel={handleCancelBooking}
              onFindParking={() => navigate("/search")}
              onViewDetails={(id) => navigate(`/reservations/${id}`)}
            />
          )}

          {tab === "history" && (
            <HistorySection
              bookings={historyBookings}
              range={historyRange}
              onRangeChange={setHistoryRange}
              onFindParking={() => navigate("/search")}
            />
          )}
        </>
      )}

      {/* QR Modal Popup */}
      {qrBooking && (
        <QrPassModal
          booking={qrBooking}
          onClose={() => setQrBooking(null)}
        />
      )}

      <div className="policy-banner">
        <ShieldCheck size={18} style={{ flexShrink: 0, color: "var(--color-teal-600)" }} />
        <div>
          <strong>Guaranteed Reservation Policy</strong>
          Need to cancel? Cancel your reservation anytime before entry for an immediate refund.
        </div>
      </div>
    </div>
  );
}

function ActiveSection({ bookings, onShowQr, onCancel, onFindParking }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-gray-200)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 24px",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        <Car size={36} color="var(--color-gray-400)" style={{ margin: "0 auto 12px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
          No Active Parking Passes
        </h3>
        <p style={{ fontSize: 14, color: "var(--color-gray-600)", margin: "0 0 20px" }}>
          You have no active parking reservations right now. Reserve a spot to get instant gate access.
        </p>
        <button className="btn btn-teal" onClick={onFindParking}>
          Find Available Parking
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {bookings.map((booking) => {
        const lotName = booking.parking?.parkingName || "Reserved Parking Spot";
        const lotAddress = booking.parking?.address || "Address available on pass";
        const slotNumber = booking.slot?.slotNumber ? `Slot ${booking.slot.slotNumber}` : "Assigned Bay";
        const vehicleDisplay = booking.vehicleName
          ? `${booking.vehicleName} ${booking.vehicleModel || ""} (${booking.plateNumber || "N/A"})`
          : "Registered Vehicle";
        const formattedDate = booking.startTime
          ? new Date(booking.startTime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Today";
        const formattedTime = booking.startTime
          ? `${new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${
              booking.endTime
                ? new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Open"
            } (${booking.hours || 1} hrs)`
          : `${booking.hours || 1} Hours Duration`;

        const price = booking.totalPrice ? Number(booking.totalPrice).toFixed(2) : "0.00";

        return (
          <div className="reservation-card" key={booking._id}>
            <div className="reservation-card-header">
              <p className="parking-card-name">{lotName}</p>
              <span className="slots-badge">
                <BadgeCheck size={12} style={{ verticalAlign: "-1px" }} /> Active Pass
              </span>
            </div>
            <p className="parking-card-address">{lotAddress}</p>

            <div className="reservation-bay-box">
              <p className="parking-card-address">Assigned Bay / Spot</p>
              <p className="parking-card-name" style={{ color: "var(--color-teal-600)" }}>
                {slotNumber}
              </p>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="reservation-detail-row">
                <CalendarDays size={14} /> Date{" "}
                <span className="reservation-detail-value">{formattedDate}</span>
              </div>
              <div className="reservation-detail-row">
                <Clock size={14} /> Time Window{" "}
                <span className="reservation-detail-value">{formattedTime}</span>
              </div>
              <div className="reservation-detail-row">
                <Car size={14} /> Vehicle{" "}
                <span className="reservation-detail-value">{vehicleDisplay}</span>
              </div>
            </div>

            <div className="reservation-total-row">
              <span className="parking-card-address">Total Paid</span>
              <span className="reservation-total-value">${price}</span>
            </div>

            <div className="reservation-actions">
              <button
                type="button"
                className="btn btn-teal btn-block"
                onClick={() => onShowQr(booking)}
              >
                <QrCode size={16} /> Show Parking Pass QR
              </button>
            </div>

            <div className="reservation-actions">
              {booking.parking?.latitude && booking.parking?.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${booking.parking.latitude},${booking.parking.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <MapPinned size={15} /> Directions <ExternalLink size={12} />
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => toast.info(`Address: ${lotAddress}`)}
                >
                  <MapPinned size={15} /> View Location
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: "var(--color-danger)", borderColor: "#fecaca" }}
                onClick={() => onCancel(booking._id)}
              >
                Cancel Pass
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UpcomingSection({ bookings, onCancel, onFindParking, onViewDetails }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-gray-200)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 24px",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        <CalendarDays size={36} color="var(--color-gray-400)" style={{ margin: "0 auto 12px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
          No Upcoming Reservations
        </h3>
        <p style={{ fontSize: 14, color: "var(--color-gray-600)", margin: "0 0 20px" }}>
          You have no scheduled bookings. Plan ahead and book guaranteed parking spaces.
        </p>
        <button className="btn btn-teal" onClick={onFindParking}>
          Browse Parking Lots
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Next Scheduled Visits</h2>
        <span className="parking-card-address">{bookings.length} Reservation(s)</span>
      </div>

      <div className="dashboard-bookings-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {bookings.map((b) => {
          const lotName = b.parking?.parkingName || "Parking Garage";
          const formattedDate = b.startTime
            ? new Date(b.startTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Scheduled";
          const formattedTime = b.startTime
            ? `${new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (${b.hours || 1} hrs)`
            : `${b.hours || 1} hrs`;
          const vehicle = b.vehicleName
            ? `${b.vehicleName} (${b.plateNumber || ""})`
            : "Vehicle Registered";

          return (
            <div className="reservation-card" key={b._id}>
              <div className="reservation-card-header">
                <span className="parking-card-address">
                  {formattedDate} · {formattedTime}
                </span>
                <div className="parking-card-price">
                  ${b.totalPrice ? Number(b.totalPrice).toFixed(2) : "0.00"}
                  <span> {b.status}</span>
                </div>
              </div>
              <div className="active-session-body" style={{ marginTop: 8 }}>
                <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
                  <Car size={16} />
                </div>
                <div>
                  <p className="parking-card-name">{lotName}</p>
                  <p className="parking-card-address">{vehicle}</p>
                </div>
              </div>
              <p className="reservation-free-cancel">Guaranteed Spot · Free Cancellation</p>
              <div className="reservation-actions">
                <button className="btn btn-teal" onClick={() => onViewDetails(b._id)}>
                  View Details
                </button>
                <button
                  className="btn btn-outline"
                  style={{ color: "var(--color-danger)", borderColor: "#fecaca" }}
                  onClick={() => onCancel(b._id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistorySection({ bookings, range, onRangeChange, onFindParking }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-gray-200)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 24px",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        <Clock size={36} color="var(--color-gray-400)" style={{ margin: "0 auto 12px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
          No Booking History
        </h3>
        <p style={{ fontSize: 14, color: "var(--color-gray-600)", margin: "0 0 20px" }}>
          Your completed and past parking receipts will appear here.
        </p>
        <button className="btn btn-teal" onClick={onFindParking}>
          Reserve a Parking Spot
        </button>
      </div>
    );
  }

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

      <div className="dashboard-bookings-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {bookings.map((b) => {
          const lotName = b.parking?.parkingName || "Parking Lot";
          const formattedDate = b.startTime
            ? new Date(b.startTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Past Date";

          return (
            <div className="reservation-card" key={b._id}>
              <div className="active-session-body">
                <div className="active-session-thumb" style={{ width: 40, height: 40 }}>
                  <Car size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="parking-card-name">{lotName}</p>
                  <p className="parking-card-address">
                    {formattedDate} · {b.hours || 1} hrs
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="parking-card-name">
                    ${b.totalPrice ? Number(b.totalPrice).toFixed(2) : "0.00"}
                  </p>
                  <p
                    className={
                      b.status === "cancelled"
                        ? "reservation-status-completed"
                        : "reservation-status-completed"
                    }
                    style={{
                      color: b.status === "cancelled" ? "var(--color-danger)" : "var(--color-success)",
                      textTransform: "capitalize",
                    }}
                  >
                    {b.status}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-block"
                style={{ marginTop: 12 }}
                onClick={() => window.print()}
              >
                <Download size={14} /> Print Receipt
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QrPassModal({ booking, onClose }) {
  const lotName = booking?.parking?.parkingName || "ParkEase Garage";
  const slotName = booking?.slot?.slotNumber ? `SLOT-${booking.slot.slotNumber}` : "General Bay";
  const plate = booking?.plateNumber || "REGISTERED VEHICLE";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(11, 28, 26, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-white)",
          borderRadius: "var(--radius-lg)",
          padding: "32px 28px",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-gray-600)",
          }}
        >
          <X size={20} />
        </button>

        <span className="slots-badge" style={{ marginBottom: 12 }}>
          ● Live Digital Gate Pass
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px", color: "var(--color-ink)" }}>
          {lotName}
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-gray-600)", margin: "0 0 20px" }}>
          Scan at barrier gate for contactless entry & exit
        </p>

        {/* QR Code Illustration */}
        <div
          style={{
            background: "var(--color-gray-50)",
            border: "2px dashed var(--color-teal-500)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            display: "inline-block",
            margin: "0 auto 20px",
          }}
        >
          <QrCode size={140} color="var(--color-teal-900)" />
        </div>

        <div
          style={{
            background: "var(--color-gray-50)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          <div>
            <span style={{ color: "var(--color-gray-400)", display: "block", fontSize: 11 }}>
              Assigned Bay
            </span>
            <strong>{slotName}</strong>
          </div>
          <div>
            <span style={{ color: "var(--color-gray-400)", display: "block", fontSize: 11 }}>
              Plate Number
            </span>
            <strong>{plate}</strong>
          </div>
        </div>

        <button className="btn btn-teal btn-block" onClick={onClose}>
          Close Pass
        </button>
      </div>
    </div>
  );
}