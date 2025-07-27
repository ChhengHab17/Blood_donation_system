"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DonorTable() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3001/api/donors") // Adjust endpoint if needed
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched donors:", data)
        setDonors(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching donors:", err)
        setLoading(false)
      })
  }, [])

const handleRowClick = (donor) => {
  const donorId = donor.id || donor.user_id;
  if (!donorId) {
    console.error("Donor ID is missing!");
    return;
  }
  navigate(`/donor-management/${donorId}/details`);
}
  const handleAddDonor = () => {
    console.log("Add donor clicked")
    // Implement your add donor logic or navigation here
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#f8f9fc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-[#000000]">Donor Table</h1>
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Donor
            </button>
          </div>
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500">Loading donors...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-[#f8f9fc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[#000000]">Donor Table</h1>
          <button
            onClick={handleAddDonor}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Donor
          </button>
        </div>

        <div className="bg-[#ffffff] rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f1f3f9]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Donation Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#1d2433] uppercase tracking-wider">
                  Expiry Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#ffffff] divide-y divide-[#f1f3f9]">
              {donors.length > 0 ? (
                donors.map((donor, index) => (
                  <tr
                    key={donor.id || index}
                    className="hover:bg-[#f8f9fc] transition-colors cursor-pointer"
                    onClick={() => handleRowClick(donor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{donor.name || donor.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{donor.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.blood_type || donor.bloodType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{donor.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.donation_date || donor.donationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.expiry_date || donor.expiryDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                    No donors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
