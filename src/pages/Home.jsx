import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find & Book Parking Slots Instantly
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Skip the circling. Reserve your parking spot in advance, anywhere near you.
          </p>
          <Link
            to="/search"
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Find Parking Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Why Choose ParkEase?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-semibold text-lg mb-2">Nearby Spots</h3>
            <p className="text-gray-600 text-sm">
              Discover available parking slots close to your destination.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="font-semibold text-lg mb-2">Instant Booking</h3>
            <p className="text-gray-600 text-sm">
              Reserve your slot in seconds — no more waiting around.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">
              Pay safely online and get instant confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section for Vendors */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Own a Parking Space?
          </h2>
          <p className="text-gray-600 mb-6">
            List your parking spot on ParkEase and start earning today.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Become a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;