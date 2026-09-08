import { Link } from "react-router-dom";

const ParkingCard = ({ parking }) => {
  const {
    _id,
    parkingName,
    address,
    totalSlots,
    pricePerHour,
  } = parking || {};

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100">
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
          {parkingName || "Unnamed Parking"}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          📍 {address || "Address not available"}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            🅿️ {totalSlots ?? 0} slots
          </span>
          <span className="text-blue-600 font-bold">
            ₹{pricePerHour ?? 0}/hr
          </span>
        </div>

        <Link
          to={`/parking/${_id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ParkingCard;