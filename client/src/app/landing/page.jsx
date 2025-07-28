export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 via-white to-white">
      {/* Logo at the top */}
      <img src="/logo.png" alt="GreenCommunity Logo" className="h-12 mb-4" />
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-green-100 p-12 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Building a Sustainable Future Together</h2>
        <p className="text-center text-gray-500 mb-8">
          Calculate your carbon footprint, discover reduction strategies, offset your impact, and join a community committed to environmental stewardship.
      </p>
        <div className="flex gap-6 mb-8 w-full justify-center">
          <button className="h-12 w-64 rounded-full bg-green-600 text-white font-semibold shadow">Calculate My Carbon Footprint</button>
          <button className="h-12 w-64 rounded-full border border-green-600 text-green-700 font-semibold shadow">Join the Community</button>
        </div>
        <div className="text-gray-400 text-sm mb-4">Trusted by environmentally conscious individuals and forward-thinking businesses</div>
        <div className="flex gap-12 justify-center w-full mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-10 rounded-full bg-green-100" />
            ))}
          </div>
        </div>
    </div>
  );
} 