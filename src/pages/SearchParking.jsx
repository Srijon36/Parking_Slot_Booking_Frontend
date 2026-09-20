import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllParkings } from "../Reducer/ParkingSlice";
import {
  Search,
  Navigation,
  Zap,
  ShieldCheck,
  ParkingCircle,
  DollarSign,
  Star,
  Loader2,
} from "lucide-react";

const FILTERS = [
  { key: "near", label: "Near Me", icon: Navigation },
  { key: "ev", label: "EV Charging", icon: Zap },
  { key: "covered", label: "Covered", icon: ParkingCircle },
  { key: "valet", label: "Valet", icon: ShieldCheck },
  { key: "price", label: "Under $15/hr", icon: DollarSign },
];

export default function SearchParking() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { parkings, loading } = useSelector((state) => state.parking);

  useEffect(() => {
    dispatch(fetchAllParkings());
  }, [dispatch]);

  // If navigated with search params (?q=...) or state (lat, lng), pre-fill the search
  const { lat, lng } = location.state || {};
  const queryParam = new URLSearchParams(location.search).get("q");
  const defaultQuery =
    queryParam || (lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "");

  const [query, setQuery] = useState(defaultQuery);
  const [activeFilter, setActiveFilter] = useState(lat && lng ? "near" : "near");

  const allLots = (parkings && parkings.length > 0)
    ? parkings.map((p, idx) => ({
        id: p._id,
        name: p.parkingName || "Downtown Parking",
        badge: idx === 0 ? "Best Match" : undefined,
        rating: (4.5 + (idx % 4) * 0.1).toFixed(1),
        reviews: 84 + idx * 72,
        distance: `${(0.3 + idx * 0.4).toFixed(1)} mi`,
        price: p.pricePerHour != null ? Number(p.pricePerHour).toFixed(2) : "10.00",
        tags: ["Covered", "EV Fast Charge", "Security"],
        spotsNote: `${p.totalSlots ?? 10} spots available now`,
        address: p.address || "",
      }))
    : [];

  const filteredLots = allLots.filter((lot) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        lot.name.toLowerCase().includes(q) ||
        lot.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeFilter === "price") {
      return parseFloat(lot.price) <= 15;
    }
    return true;
  });

  return (
    <div>
      <div className="search-header">
        <div>
          <div className="search-live-badge">
            <span className="search-live-dot" /> Live Availability
          </div>
          <h1 className="dashboard-title" style={{ margin: 0 }}>Find Parking</h1>
        </div>

        <form
          className="search-toolbar"
          style={{ padding: 0, margin: 0 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, lot, or address"
            style={{ minWidth: 260 }}
          />
          <button type="submit" className="btn btn-teal">
            <Search size={15} /> Search
          </button>
        </form>
      </div>

      <div className="filter-bar" style={{ padding: "0 24px 16px", maxWidth: "var(--container-width)", margin: "0 auto" }}>
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = activeFilter === f.key;
          return (
            <button
              key={f.key}
              className={`filter-pill${active ? " active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              <Icon size={13} /> {f.label}
            </button>
          );
        })}
      </div>

      <div className="search-layout">
        <div>
          <div className="dashboard-section-header" style={{ marginBottom: 12 }}>
            <h2 className="dashboard-section-title">
              Available Lots · {loading ? "Loading..." : `${filteredLots.length} found`}
            </h2>
            <span className="dashboard-view-all">Sort by: Distance</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0", gap: 10, color: "var(--color-gray-600)" }}>
              <Loader2 className="animate-spin" size={24} /> Loading available lots...
            </div>
          ) : filteredLots.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-gray-600)", background: "white", borderRadius: 12, border: "1px solid var(--color-gray-200)" }}>
              <p style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px" }}>No parking spots found</p>
              <p style={{ fontSize: 14, margin: 0 }}>Try clearing your search query or adjusting your filters.</p>
              {query && (
                <button
                  className="btn btn-teal"
                  style={{ marginTop: 16 }}
                  onClick={() => setQuery("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="results-list">
              {filteredLots.map((lot) => (
                <div className="parking-card" key={lot.id}>
                  <div className="parking-card-thumb" />
                  <div className="parking-card-body">
                    <div className="parking-card-top">
                      <div>
                        <p className="parking-card-name">
                          {lot.name}
                          {lot.badge && <span className="slots-badge" style={{ marginLeft: 8 }}>{lot.badge}</span>}
                        </p>
                        <p className="parking-card-address">
                          <Star size={12} fill="currentColor" style={{ verticalAlign: "-1px" }} /> {lot.rating} ({lot.reviews}) · {lot.distance}
                        </p>
                        {lot.address && (
                          <p style={{ fontSize: 12, color: "var(--color-gray-500)", margin: "2px 0 0" }}>
                            📍 {lot.address}
                          </p>
                        )}
                      </div>
                      <div className="parking-card-price">
                        ${lot.price}
                        <span> /hour</span>
                      </div>
                    </div>

                    <div className="parking-card-meta">
                      {lot.tags.map((t) => (
                        <span key={t}>· {t}</span>
                      ))}
                    </div>

                    <div className="parking-card-footer">
                      <span className="parking-card-address">{lot.spotsNote}</span>
                      <button className="btn btn-teal" onClick={() => navigate(`/parking/${lot.id}`)}>
                        Reserve Spot
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map placeholder */}
        <div className="map-panel">Map view</div>
      </div>
    </div>
  );
}