import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../store/Api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: "user",
      };
      await api.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <div>
          <span
            className="hero-eyebrow"
            style={{ background: "var(--color-teal-100)", color: "var(--color-teal-700)", border: "none" }}
          >
            ⚙ Join ParkEase Network
          </span>
          <h1 className="register-headline">
            Smart parking solutions for <span className="accent">drivers</span> across the city.
          </h1>
          <p className="register-copy">
            Secure a hassle-free spot in the congested city center. ParkEase gives you
            real-time availability, instant reservations, and seamless digital passes.
          </p>

          <div className="register-info-cards">
            <div className="register-info-card">
              <div className="feature-icon">🚗</div>
              <h4>For Drivers</h4>
              <p>Instant bay discovery, EV charger filters, and automated entry.</p>
            </div>
            <div className="register-info-card">
              <div className="feature-icon">⏱️</div>
              <h4>Fast Booking</h4>
              <p>Reserve your slot in seconds and skip the endless circling.</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Go back"
          >
            ← Back
          </button>

          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Create an account</p>
          <p className="auth-subtitle" style={{ textAlign: "left", marginBottom: 20 }}>
            Enter your details to get started.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Alex Johnson"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{ marginTop: 6 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ marginTop: 6 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ marginTop: 6 }}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={{ marginTop: 6 }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ marginTop: 6 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-teal btn-block" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up →"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="form-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;