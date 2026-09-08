const statusColors = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

const BookingCard = ({ booking, onCancel }) => {
  const {
    _id,
    parkingName,
    address,
    startTime,
    endTime,
    status,
    totalAmount,
  } = booking || {};

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{parkingName || "Parking Slot"}</h3>
          <p className="text-sm text-gray-500">📍 {address || "N/A"}</p>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
            statusColors[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status || "unknown"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
        <div>
          <span className="font-medium text-gray-700">Start:</span> {formatDate(startTime)}
        </div>
        <div>
          <span className="font-medium text-gray-700">End:</span> {formatDate(endTime)}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-blue-600 font-bold">₹{totalAmount ?? 0}</span>

        {status === "confirmed" || status === "pending" ? (
          <button
            onClick={() => onCancel?.(_id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Cancel Booking
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default BookingCard;