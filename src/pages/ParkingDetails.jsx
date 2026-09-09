import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParkingById, clearSelectedParking } from "../Reducer/ParkingSlice";
import Loader from "../components/Loader";

const ParkingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedParking, loading, error } = useSelector((state) => state.parking);

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

  const { parkingName, address, totalSlots, pricePerHour, latitude, longitude } = selectedParking;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{parkingName}</h1>
      <p className="text-gray-500 mb-6">📍 {address}</p>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Slots</p>
            <p className="font-semibold text-gray-900">{totalSlots}</p>
          </div>
          <div>
            <p className="text-gray-500">Price / Hour</p>
            <p className="font-semibold text-blue-600">₹{pricePerHour}</p>
          </div>
        </div>

        {latitude && longitude && (
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 text-sm hover:underline"
          >
            View on Google Maps →
          </a>
        )}
      </div>

      <Link
        to={`/booking/${selectedParking._id}`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
      >
        Book This Slot
      </Link>
    </div>
  );
};

export default ParkingDetails;