import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingById, cancelBooking, clearSelectedBooking } from "../Reducer/BookingSlice";
import Loader from "../components/Loader";

const ReservationDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBooking, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookingById(id));
    return () => dispatch(clearSelectedBooking());
  }, [dispatch, id]);

  if (loading) return <Loader fullScreen />;

  if (error || !selectedBooking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error || "Reservation not found."}</p>
      </div>
    );
  }

  const { parkingName, address, startTime, endTime, status, totalAmount, vehicleNumber } = selectedBooking;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reservation Details</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Parking</p>
          <p className="font-semibold text-gray-900">{parkingName}</p>
          <p className="text-sm text-gray-500">📍 {address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start Time</p>
            <p className="font-medium text-gray-900">{formatDate(startTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Time</p>
            <p className="font-medium text-gray-900">{formatDate(endTime)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vehicle Number</p>
          <p className="font-medium text-gray-900">{vehicleNumber || "N/A"}</p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-blue-600 font-bold text-lg">₹{totalAmount ?? 0}</span>
          <span className="text-sm font-semibold capitalize px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        </div>

        {(status === "confirmed" || status === "pending") && (
          <button
            onClick={() => dispatch(cancelBooking(id))}
            className="w-full text-red-600 border border-red-200 hover:bg-red-50 font-medium py-2.5 rounded-lg transition"
          >
            Cancel Reservation
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;