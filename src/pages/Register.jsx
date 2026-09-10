import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../store/Api";

const Register = () => {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    parkingName: "",
    address: "",
    gstNumber: "",
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
        role,
        ...(role === "vendor" && {
          parkingName: formData.parkingName,
          address: formData.address,
          gstNumber: formData.gstNumber,
        }),
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
          <span className="hero-eyebrow" style={{ background: "var(--color-teal-100)", color: "var(--color-teal-700)", border: "none" }}>
            ⚙ Join ParkEase Network
          </span>
          <h1 className="register-headline">
            Smart parking solutions for <span className="accent">drivers</span> and{" "}
            <span className="accent">property owners</span>.
          </h1>
          <p className="register-copy">
            Whether you're looking to secure a hassle-free spot in the congested city center or
            monetize your empty parking spaces, ParkEase gives you absolute control with
            real-time analytics and instant reservations.
          </p>

          <div className="register-info-cards">
            <div className="register-info-card">
              <div className="feature-icon">🚗</div>
              <h4>For Drivers</h4>
              <p>Instant bay discovery, EV charger filters, and automated entry.</p>
            </div>
            <div className="register-info-card">
              <div className="feature-icon">🏢</div>
              <h4>For Vendors</h4>
              <p>Maximize revenue, dynamic pricing control, and live occupancy streams.</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Create an account</p>
          <p className="auth-subtitle" style={{ textAlign: "left", marginBottom: 20 }}>
            Choose your role and enter your details to get started.
          </p>

          <div className="role-toggle">
            <button type="button" className={role === "user" ? "active" : ""} onClick={() => setRole("user")}>
              👤 I'm a User
            </button>
            <button type="button" className={role === "vendor" ? "active" : ""} onClick={() => setRole("vendor")}>
              🏬 I'm a Vendor
            </button>
          </div>

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

            {role === "vendor" && (
              <>
                <div className="form-group">
                  <label className="form-label">Parking Name</label>
                  <input
                    type="text"
                    name="parkingName"
                    className="form-input"
                    value={formData.parkingName}
                    onChange={handleChange}
                    required
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    className="form-input"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    required
                    style={{ marginTop: 6 }}
                  />
                </div>
              </>
            )}

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