import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlotsByParking, selectSlot } from "../Reducer/SlotSlice";
import Loader from "../components/Loader";

const AvailableSlots = () => {
  const { parkingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slots, loading, error } = useSelector((state) => state.slot);

  useEffect(() => {
    dispatch(fetchSlotsByParking(parkingId));
  }, [dispatch, parkingId]);

  const handleSelect = (slot) => {
    dispatch(selectSlot(slot));
    navigate(`/booking/${parkingId}`);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Slots</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {slots?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No slots available right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {slots?.map((slot) => (
            <button
              key={slot._id}
              disabled={slot.isBooked}
              onClick={() => handleSelect(slot)}
              className={`p-4 rounded-lg border text-sm font-medium transition ${
                slot.isBooked
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white"
              }`}
            >
              Slot {slot.slotNumber ?? "?"}
              {slot.isBooked && <div className="text-xs mt-1">Booked</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;