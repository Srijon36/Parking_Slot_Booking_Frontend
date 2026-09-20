import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParkingById, clearSelectedParking } from "../Reducer/ParkingSlice";
import { fetchSlotsByParking } from "../Reducer/SlotSlice";
import { createBooking } from "../Reducer/BookingSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  Car,
  Tag,
  Hash,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";

const PRESET_HOURS = [1, 2, 3, 4, 8];

const ParkingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedParking, loading, error } = useSelector((state) => state.parking);
  const { slots } = useSelector((state) => state.slot);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Form states
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [hours, setHours] = useState(2);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchParkingById(id));
      dispatch(fetchSlotsByParking(id));
    }
    return () => {
      dispatch(clearSelectedParking());
    };
  }, [dispatch, id]);

  // When slots load, auto-select first available slot if none selected
  useEffect(() => {
    if (slots && slots.length > 0 && !selectedSlotId) {
      const firstAvailable = slots.find((s) => !s.isBooked);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable._id);
      }
    }
  }, [slots, selectedSlotId]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !selectedParking) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl shadow-md border border-gray-100 text-center">
        <div style={{ fontSize: 36, marginBottom: 12 }}>🚗</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Parking Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">
          {error || "The parking slot you requested does not exist or has been removed."}
        </p>
        <Link to="/search" className="btn btn-teal">
          Find Available Parking
        </Link>
      </div>
    );
  }

  const {
    _id: parkingId,
    parkingName,
    address,
    totalSlots = 0,
    pricePerHour = 0,
    latitude,
    longitude,
  } = selectedParking;

  const availableSlotsList = slots?.filter((s) => !s.isBooked) || [];
  const availableCount = availableSlotsList.length > 0 ? availableSlotsList.length : totalSlots;
  const rate = Number(pricePerHour) || 10;
  const totalPrice = (rate * hours).toFixed(2);

  const handleDurationChange = (delta) => {
    setHours((prev) => Math.max(1, Math.min(24, prev + delta)));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!vehicleName.trim()) {
      setFormError("Please enter your Car Name / Make (e.g. Honda, Toyota).");
      return;
    }
    if (!vehicleModel.trim()) {
      setFormError("Please enter your Car Model (e.g. Civic, Corolla).");
      return;
    }
    if (!plateNumber.trim()) {
      setFormError("Please enter your License Plate Number.");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Please log in to complete your reservation.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        parkingId,
        slotId: selectedSlotId || undefined,
        vehicleName: vehicleName.trim(),
        vehicleModel: vehicleModel.trim(),
        plateNumber: plateNumber.trim().toUpperCase(),
        hours,
        totalPrice: parseFloat(totalPrice),
        startTime: new Date().toISOString(),
      };

      const result = await dispatch(createBooking(payload)).unwrap();
      const bookingId = result?.booking?._id || result?._id;

      toast.success("Parking spot reserved successfully!");
      navigate(bookingId ? `/payment/${bookingId}` : "/reservations", {
        state: {
          booking: result?.booking || result,
          vehicleName,
          vehicleModel,
          plateNumber,
          hours,
          totalPrice,
        },
      });
    } catch (err) {
      console.error("Booking submission error:", err);
      setFormError(err || "Failed to complete reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="booking-page-wrap">
        {/* Navigation Bar */}
        <div className="booking-top-nav">
          <Link to="/search" className="booking-back-btn">
            <ArrowLeft size={16} /> Back to Find Parking
          </Link>
          <span style={{ fontSize: 13, color: "var(--color-gray-600)", fontWeight: 500 }}>
            Instant Reservation · Guaranteed Space
          </span>
        </div>

        <div className="booking-layout-grid">
          {/* LEFT: Parking Info & Amenities */}
          <div className="booking-card-main">
            <div className="booking-hero-header">
              <div className="booking-live-chip">
                <span className="booking-live-chip-dot" /> Live Availability
              </div>
              <h1 className="booking-title">{parkingName}</h1>
              <p className="booking-address">
                <MapPin size={15} color="var(--color-teal-600)" />
                {address || "Address available on confirmation"}
                {latitude && longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 10,
                      color: "var(--color-teal-600)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Maps <ExternalLink size={12} />
                  </a>
                )}
              </p>
            </div>

            {/* Quick Stat Tiles */}
            <div className="booking-stats-grid">
              <div className="booking-stat-box">
                <div className="booking-stat-label">Total Capacity</div>
                <div className="booking-stat-val">{totalSlots} Slots</div>
              </div>
              <div className="booking-stat-box">
                <div className="booking-stat-label">Available Now</div>
                <div className="booking-stat-val green">{availableCount} Spots</div>
              </div>
              <div className="booking-stat-box">
                <div className="booking-stat-label">Hourly Rate</div>
                <div className="booking-stat-val teal">${Number(rate).toFixed(2)} /hr</div>
              </div>
            </div>

            {/* Parking Highlights / Features */}
            <div className="booking-section-subhead">
              <Sparkles size={18} color="var(--color-teal-600)" /> Garage Highlights & Amenities
            </div>
            <div className="booking-features-list">
              <div className="booking-feature-card">
                <div className="booking-feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="booking-feature-title">24/7 Security</p>
                  <p className="booking-feature-desc">CCTV monitored with guard patrol</p>
                </div>
              </div>
              <div className="booking-feature-card">
                <div className="booking-feature-icon">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="booking-feature-title">EV Charging</p>
                  <p className="booking-feature-desc">Fast charge stations available</p>
                </div>
              </div>
              <div className="booking-feature-card">
                <div className="booking-feature-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="booking-feature-title">Covered Parking</p>
                  <p className="booking-feature-desc">Weather & sun protected bays</p>
                </div>
              </div>
              <div className="booking-feature-card">
                <div className="booking-feature-icon">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="booking-feature-title">Contactless Pass</p>
                  <p className="booking-feature-desc">Automated license plate & QR entry</p>
                </div>
              </div>
            </div>

            {/* Optional Slot Selector */}
            {slots && slots.length > 0 && (
              <div className="booking-slots-picker-wrap">
                <div className="booking-section-subhead" style={{ marginTop: 24 }}>
                  <Car size={18} color="var(--color-teal-600)" /> Select Slot (Optional)
                </div>
                <p style={{ fontSize: 13, color: "var(--color-gray-600)", margin: "0 0 10px" }}>
                  Pick your preferred spot or leave the auto-assigned slot.
                </p>
                <div className="booking-slots-grid">
                  {slots.map((s) => {
                    const isSelected = selectedSlotId === s._id;
                    return (
                      <button
                        type="button"
                        key={s._id}
                        disabled={s.isBooked}
                        className={`booking-slot-pill ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedSlotId(s._id)}
                      >
                        {s.slotNumber}
                        {s.isBooked && (
                          <span style={{ display: "block", fontSize: 10, opacity: 0.8 }}>
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Vehicle Details & Booking Form */}
          <div className="booking-form-panel">
            <div className="booking-form-header">
              <h2 className="booking-form-title">Vehicle & Booking Details</h2>
              <p className="booking-form-subtitle">
                Fill in your car details to reserve this parking slot instantly.
              </p>
            </div>

            {formError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Info size={16} /> {formError}
              </div>
            )}

            <form onSubmit={handleBookSubmit}>
              {/* Car Name / Brand */}
              <div className="booking-field-group">
                <label className="booking-field-label">
                  Car Name / Make <span>*</span>
                </label>
                <div className="booking-input-container">
                  <Car size={17} className="booking-input-icon" />
                  <input
                    type="text"
                    required
                    className="booking-text-input"
                    placeholder="e.g. Honda, Toyota, Tesla, Hyundai"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                  />
                </div>
              </div>

              {/* Car Model */}
              <div className="booking-field-group">
                <label className="booking-field-label">
                  Car Model <span>*</span>
                </label>
                <div className="booking-input-container">
                  <Tag size={17} className="booking-input-icon" />
                  <input
                    type="text"
                    required
                    className="booking-text-input"
                    placeholder="e.g. Civic, Camry, Model 3, Creta"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </div>
              </div>

              {/* Plate Number */}
              <div className="booking-field-group">
                <label className="booking-field-label">
                  License Plate Number <span>*</span>
                </label>
                <div className="booking-input-container">
                  <Hash size={17} className="booking-input-icon" />
                  <input
                    type="text"
                    required
                    className="booking-text-input"
                    placeholder="e.g. ABC-1234 or WB 02 AB 1234"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Duration Selector */}
              <div className="booking-field-group">
                <label className="booking-field-label">Booking Duration (Hours)</label>
                <div className="booking-duration-ctrl">
                  <button
                    type="button"
                    className="booking-duration-btn"
                    onClick={() => handleDurationChange(-1)}
                    disabled={hours <= 1}
                  >
                    −
                  </button>
                  <div className="booking-duration-display">
                    {hours} {hours === 1 ? "Hour" : "Hours"}
                  </div>
                  <button
                    type="button"
                    className="booking-duration-btn"
                    onClick={() => handleDurationChange(1)}
                    disabled={hours >= 24}
                  >
                    +
                  </button>
                </div>

                {/* Preset quick buttons */}
                <div className="booking-presets-row">
                  {PRESET_HOURS.map((h) => (
                    <button
                      type="button"
                      key={h}
                      className={`booking-preset-pill ${hours === h ? "active" : ""}`}
                      onClick={() => setHours(h)}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="booking-pricing-box">
                <div className="booking-pricing-line">
                  <span>
                    Parking Fee (${rate.toFixed(2)} × {hours} hrs)
                  </span>
                  <span>${(rate * hours).toFixed(2)}</span>
                </div>
                <div className="booking-pricing-line">
                  <span>Digital Pass & Reservation Fee</span>
                  <span style={{ color: "#34d399" }}>Free</span>
                </div>
                <div className="booking-pricing-total">
                  <span>Total Amount</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="booking-cta-btn"
              >
                {submitting ? "Reserving Your Spot..." : "Confirm & Proceed to Payment →"}
              </button>

              <div className="booking-security-note">
                <Lock size={13} /> Secure reservation · Cancel free up to 1 hr before arrival
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;