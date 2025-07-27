import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function InventoryTable1() {
  const [inventoryData, setInventoryData] = useState([])

  // Fetch inventory data from backend on component mount
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/inventory')
      .then((res) => {
        setInventoryData(res.data)
      })
      .catch((err) => {
        console.error('Error fetching inventory data:', err)
      })
  }, [])

  return (
    <div className="p-8 bg-[#f8f9fc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#000000] mb-6">InventoryTable</h1>

        <div className="bg-[#ffffff] rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f1f3f9] border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Blood ID</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Blood Type</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Quantity</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Donation Date</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              ) : (
                inventoryData.map((item, index) => (
                  <tr key={item.blood_id} className={index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f8f9fc]"}>
                    <td className="py-4 px-6 text-[#000000]">{item.blood_id}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.blood_type}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.quantity}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.donation_date}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.expiry_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
