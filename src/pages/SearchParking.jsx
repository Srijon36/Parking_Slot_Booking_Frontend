import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Navigation,
  Zap,
  ShieldCheck,
  ParkingCircle,
  DollarSign,
  Star,
} from "lucide-react";

/**
 * Search Parking — web layout.
 * Reuses your existing .search-header / .filter-bar / .search-layout /
 * .parking-card / .map-panel classes already defined in custom.css.
 *
 * Replace `mockLots` with ParkingSlice results once wired up, e.g.:
 *   const lots = useSelector((s) => s.parking.results);
 *   dispatch(searchParking({ query, filters }));
 */
const FILTERS = [
  { key: "near", label: "Near Me", icon: Navigation },
  { key: "ev", label: "EV Charging", icon: Zap },
  { key: "covered", label: "Covered", icon: ParkingCircle },
  { key: "valet", label: "Valet", icon: ShieldCheck },
  { key: "price", label: "Under $15/hr", icon: DollarSign },
];

const mockLots = [
  {
    id: "downtown-central",
    name: "Downtown Central",
    badge: "Best Match",
    rating: 4.8,
    reviews: 320,
    distance: "0.3 mi",
    price: "12.50",
    tags: ["Covered", "EV Fast Charge", "Security"],
    spotsNote: "18 spots available now",
  },
  {
    id: "riverside-plaza",
    name: "Riverside Plaza Lot",
    rating: 4.4,
    reviews: 84,
    distance: "0.7 mi",
    price: "7.00",
    tags: ["Valet Assist", "24/7 Monitored", "Accessible"],
    spotsNote: "Only 5 spots left · filling fast",
  },
  {
    id: "city-center",
    name: "City Center Lot",
    rating: 4.9,
    reviews: 210,
    distance: "1.2 mi",
    price: "15.75",
    tags: ["Roof", "Security"],
    spotsNote: "32 spots available",
  },
];

export default function SearchParking() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("Financial District, Downtown");
  const [activeFilter, setActiveFilter] = useState("near");

  return (
    <div>
      <div className="search-header">
        <div>
          <div className="search-live-badge">
            <span className="search-live-dot" /> Live Availability
          </div>
          <h1 className="dashboard-title" style={{ margin: 0 }}>Find Parking</h1>
        </div>

        <div className="search-toolbar" style={{ padding: 0, margin: 0 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, lot, or address"
            style={{ minWidth: 260 }}
          />
          <button className="btn btn-teal">
            <Search size={15} /> Search
          </button>
        </div>
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
            <h2 className="dashboard-section-title">Available Lots · {mockLots.length} found</h2>
            <span className="dashboard-view-all">Sort by: Distance</span>
          </div>

          <div className="results-list">
            {mockLots.map((lot) => (
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
        </div>

        {/* Map placeholder — swap for your maps SDK (Google Maps / Mapbox) */}
        <div className="map-panel">Map view</div>
      </div>
    </div>
  );
}