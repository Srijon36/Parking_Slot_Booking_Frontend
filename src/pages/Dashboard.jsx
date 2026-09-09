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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back, {user?.fullName || "there"} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here's what's happening with your bookings.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-gray-500 text-sm mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{bookings?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-gray-500 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings?.filter((b) => b.status === "confirmed").length ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-gray-500 text-sm mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-500">
            {bookings?.filter((b) => b.status === "cancelled").length ?? 0}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <Link to="/reservations" className="text-blue-600 text-sm font-medium hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : recentBookings.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentBookings.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;