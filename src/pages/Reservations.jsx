import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings, cancelBooking } from "../Reducer/BookingSlice";
import BookingCard from "../components/BookingCard";
import Loader from "../components/Loader";

const Reservations = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = (bookingId) => {
    dispatch(cancelBooking(bookingId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reservations</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You have no reservations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings?.map((b) => (
            <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;