import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(location ? `/search?q=${encodeURIComponent(location)}` : "/search");
  };

  return (
    <div className="page-shell">
      <section className="hero">
        <span className="hero-eyebrow">⚡ Urban Mobility Reimagined</span>
        <h1 className="hero-title">Find & Book Parking Slots Instantly</h1>
        <p className="hero-subtitle">
          Skip the endless circling. Reserve guaranteed parking spaces across the city with
          real-time availability and seamless digital passes.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <div className="hero-search-field">
            <span className="hero-search-label">📍 Location or Landmark</span>
            <input
              type="text"
              placeholder="Where are you parking?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="hero-search-divider" />
          <div className="hero-search-field">
            <span className="hero-search-label">🕐 Date & Time</span>
            <input type="text" placeholder="Today, 2:00 PM – 5:00 PM" readOnly />
          </div>
          <button type="submit" className="btn btn-teal">
            🔍 Search Slots
          </button>
        </form>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-value">15,000+</div>
            <div className="hero-stat-label">Verified Spaces</div>
          </div>
          <div>
            <div className="hero-stat-value">99.8%</div>
            <div className="hero-stat-label">Booking Success</div>
          </div>
          <div>
            <div className="hero-stat-value">$4.2M</div>
            <div className="hero-stat-label">Driver Savings</div>
          </div>
          <div>
            <div className="hero-stat-value">24/7</div>
            <div className="hero-stat-label">Live Support</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-grid">
            <div>
              <p className="section-eyebrow">Unmatched Reliability</p>
              <h2 className="section-title">Why Choose ParkEase</h2>
            </div>
            <p style={{ color: "var(--color-gray-600)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              Designed for modern urbanites who value their time. Experience frictionless
              parking management powered by cutting-edge real-time data.
            </p>
          </div>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Nearby Spots</h3>
              <p>Discover available parking slots close to your destination, updated live.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Instant Booking</h3>
              <p>Reserve your slot in seconds — no more circling the block.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Pay safely online and get instant confirmation for every booking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <h2 className="section-title" style={{ marginBottom: 8 }}>
          Own a Parking Space?
        </h2>
        <p style={{ color: "var(--color-gray-600)", marginBottom: 24 }}>
          List your parking spot on ParkEase and start earning today.
        </p>
        <a href="/register" className="btn btn-dark">
          Become a Vendor
        </a>
      </section>
    </div>
  );
};

export default Home;