import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParkingById, clearSelectedParking } from "../Reducer/ParkingSlice";
import Loader from "../components/Loader";

const Booking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedParking, loading, error } = useSelector((state) => state.parking);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [hours, setHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchParkingById(id));
    return () => dispatch(clearSelectedParking());
  }, [dispatch, id]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !selectedParking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error || "Parking not found."}</p>
      </div>
    );
  }

  const { parkingName, address, pricePerHour } = selectedParking;
  const totalPrice = pricePerHour * hours;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!vehicleNumber.trim()) {
      setFormError("Please enter your vehicle number.");
      return;
    }
    if (hours < 1) {
      setFormError("Booking duration must be at least 1 hour.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: dispatch a booking thunk here, e.g.
      // await dispatch(createBooking({ parkingId: id, vehicleNumber, hours })).unwrap();
      navigate(`/payment/${id}`, { state: { vehicleNumber, hours, totalPrice } });
    } catch (err) {
      setFormError(err?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Slot</h1>
      <p className="text-gray-500 mb-6">
        {parkingName} — {address}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-5"
      >
        <div>
          <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Number
          </label>
          <input
            id="vehicleNumber"
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="e.g. WB 12 AB 3456"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            id="hours"
            type="number"
            min="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <span className="text-gray-500 text-sm">Total Price</span>
          <span className="text-lg font-semibold text-blue-600">₹{totalPrice}</span>
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {submitting ? "Booking..." : "Confirm & Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

export default Booking;