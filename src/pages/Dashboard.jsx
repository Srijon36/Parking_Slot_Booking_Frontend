import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../Reducer/BookingSlice";
import BookingCard from "../components/BookingCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const recentBookings = bookings?.slice(0, 3) || [];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">
        Welcome back, {user?.fullName || "there"} 👋
      </h1>
      <p className="dashboard-subtitle">Here's what's happening with your bookings.</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-card-label">Total Bookings</p>
          <p className="stat-card-value">{bookings?.length ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Active</p>
          <p className="stat-card-value active">
            {bookings?.filter((b) => b.status === "confirmed").length ?? 0}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Cancelled</p>
          <p className="stat-card-value cancelled">
            {bookings?.filter((b) => b.status === "cancelled").length ?? 0}
          </p>
        </div>
      </div>

      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Recent Bookings</h2>
        <Link to="/reservations" className="dashboard-view-all">
          View All
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : recentBookings.length === 0 ? (
        <p className="empty-state">No bookings yet.</p>
      ) : (
        <div className="dashboard-bookings-grid">
          {recentBookings.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;