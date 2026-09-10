import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure, clearAuthError } from "../Reducer/AuthSlice";
import api from "../store/Api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(loginStart());
    try {
      const response = await api.post("/auth/login", formData);
      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed. Please try again."));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-icon">🔒</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your details to access your ParkEase account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-row">
                <label className="form-label">Email Address</label>
              </div>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="form-link">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="form-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;