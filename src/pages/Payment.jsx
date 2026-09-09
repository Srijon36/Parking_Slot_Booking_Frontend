import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPayment } from "../Reducer/PaymentSlice";

const Payment = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.payment);

  const handlePay = async (method) => {
    const result = await dispatch(createPayment({ bookingId, method }));

    if (createPayment.fulfilled.match(result)) {
      navigate("/payment-history");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
        <button
          onClick={() => handlePay("card")}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Processing..." : "Pay with Card"}
        </button>

        <button
          onClick={() => handlePay("upi")}
          disabled={loading}
          className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Processing..." : "Pay with UPI"}
        </button>
      </div>
    </div>
  );
};

export default Payment;