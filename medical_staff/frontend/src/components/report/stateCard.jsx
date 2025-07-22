export default function StatsCards() {
    const bloodTypes = [
      { type: "A+", volume: "20ml" },
      { type: "A-", volume: "20ml" },
      { type: "B+", volume: "20ml" },
      { type: "B-", volume: "20ml" },
      { type: "AB+", volume: "20ml" },
      { type: "AB-", volume: "20ml" },
      { type: "O+", volume: "20ml" },
      { type: "O-", volume: "20ml" },
    ]
  
    return (
      <div className="grid grid-cols-[1fr_1fr_2fr] gap-1 mb-8">
        {/* Donation Count */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center h-48">
            <h3 className="text-gray-600 text-lg font-medium mb-4 text-center">Donation count</h3>

            <div className="flex-grow flex items-center justify-center w-full">
                <p className="text-4xl font-bold text-gray-800">20</p>
            </div>
        </div>
  
        {/* Pending Request */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center h-48">
            <h3 className="text-gray-600 text-lg font-medium mb-4 text-center">Pending Request</h3>

            <div className="flex-grow flex items-center justify-center w-full">
                <p className="text-4xl font-bold text-gray-800">20</p>
            </div>
        </div>
  
        {/* Blood Inventory */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-600 text-lg font-medium mb-4">Blood inventory</h3>
          <div className="grid grid-cols-4 gap-2">
            {bloodTypes.map((blood) => (
              <div key={blood.type} className="text-center">
                <div className="text-red-600 font-semibold text-sm">{blood.type}</div>
                <div className="text-gray-600 text-xs">{blood.volume}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }