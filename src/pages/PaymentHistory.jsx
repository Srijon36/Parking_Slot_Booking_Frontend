import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPayments } from "../Reducer/PaymentSlice";
import PaymentCard from "../components/PaymentCard";
import Loader from "../components/Loader";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchMyPayments());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : payments?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No payments found.</p>
      ) : (
        <div className="space-y-4">
          {payments?.map((p) => (
            <PaymentCard key={p._id} payment={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;