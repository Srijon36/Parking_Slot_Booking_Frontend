import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllParkings } from "../Reducer/ParkingSlice";
import { Link } from "react-router-dom";

const SearchParking = () => {
  const dispatch = useDispatch();
  const { parkings, loading } = useSelector((state) => state.parking);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllParkings());
  }, [dispatch]);

  const filtered = parkings?.filter(
    (p) =>
      p.parkingName?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell">
      <div className="search-header">
        <div>
          <p className="search-live-badge">
            <span className="search-live-dot" /> LIVE AVAILABILITY
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Find & Reserve Parking</h1>
        </div>

        <div className="filter-bar">
          <button className={`filter-pill ${activeFilter === "all" ? "active" : ""}`} onClick={() => setActiveFilter("all")}>
            ⚙ All Filters
          </button>
          <button className="filter-pill">🔋 EV Charging</button>
          <button className="filter-pill">☂ Covered</button>
          <button className="filter-pill">🎩 Valet</button>
        </div>
      </div>

      <div className="search-toolbar">
        <input
          type="text"
          placeholder="Search location, garage, landmark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select>
          <option>Now (Immediate Entry)</option>
        </select>
        <select>
          <option>Max Hourly Rate: Any</option>
        </select>
        <select>
          <option>Distance: Within 1 mile</option>
        </select>
      </div>

      <div className="search-layout">
        <div className="results-list">
          {loading ? (
            <div className="loader-wrap">
              <div className="loader-spinner" />
            </div>
          ) : filtered?.length === 0 ? (
            <p className="empty-state">No parking spots found.</p>
          ) : (
            filtered?.map((p) => (
              <div className="parking-card" key={p._id}>
                <div className="parking-card-thumb" />
                <div className="parking-card-body">
                  <div className="parking-card-top">
                    <div>
                      <p className="parking-card-name">{p.parkingName}</p>
                      <p className="parking-card-address">📍 {p.address}</p>
                    </div>
                    <span className="slots-badge">● {p.totalSlots} slots left</span>
                  </div>

                  <div className="parking-card-footer">
                    <span className="parking-card-price">
                      ₹{p.pricePerHour} <span>/hr</span>
                    </span>
                    <Link to={`/parking/${p._id}`} className="btn btn-teal">
                      Book Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="map-panel">Map view coming soon</div>
      </div>
    </div>
  );
};

export default SearchParking;