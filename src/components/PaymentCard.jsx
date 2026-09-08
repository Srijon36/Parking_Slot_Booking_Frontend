const statusColors = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const PaymentCard = ({ payment }) => {
  const {
    _id,
    amount,
    method,
    status,
    createdAt,
    transactionId,
  } = payment || {};

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-900">₹{amount ?? 0}</p>
        <p className="text-sm text-gray-500">{method || "N/A"} • {formatDate(createdAt)}</p>
        {transactionId && (
          <p className="text-xs text-gray-400 mt-1">Txn ID: {transactionId}</p>
        )}
      </div>

      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
          statusColors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status || "unknown"}
      </span>
    </div>
  );
};

export default PaymentCard;