export default function DonorTable() {
    const donorData = [
      { id: "Text", name: "Text", bloodType: "Text", volume: "Text", date: "Text", staff: "Text" },
      { id: "Text", name: "Text", bloodType: "Text", volume: "Text", date: "Text", staff: "Text" },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 ml-4">Donor Table</h2>
        
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Of Blood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donorData.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.bloodType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.volume}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export
          </button>
        </div>
      </div>
    )
  }
  