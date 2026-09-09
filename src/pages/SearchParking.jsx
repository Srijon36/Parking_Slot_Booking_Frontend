import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllParkings } from "../Reducer/ParkingSlice";
import ParkingCard from "../components/ParkingCard";
import Loader from "../components/Loader";

const SearchParking = () => {
  const dispatch = useDispatch();
  const { parkings, loading } = useSelector((state) => state.parking);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllParkings());
  }, [dispatch]);

  const filtered = parkings?.filter((p) =>
    p.parkingName?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Parking</h1>

      <input
        type="text"
        placeholder="Search by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-8"
      />

      {loading ? (
        <Loader />
      ) : filtered?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No parking spots found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((p) => (
            <ParkingCard key={p._id} parking={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchParking;