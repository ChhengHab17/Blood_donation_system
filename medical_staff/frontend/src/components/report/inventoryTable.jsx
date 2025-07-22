export default function InventoryTable() {
    const inventoryData = [
      { bloodType: "Text", unitInStock: "Text", expiryDate: "Text", volume: "Text" },
      { bloodType: "Text", unitInStock: "Text", expiryDate: "Text", volume: "Text" },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 ml-4">InventoryTable</h2>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit In Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.bloodType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.unitInStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.volume}</td>
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