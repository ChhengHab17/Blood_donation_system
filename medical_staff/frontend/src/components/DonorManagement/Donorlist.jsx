"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function DonorTable() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  const fetchDonors = async (pageNum = 1, append = false) => {
    try {
      const response = await fetch(`http://localhost:3000/api/donors?page=${pageNum}&limit=10`)
      const data = await response.json()
      
      if (append) {
        setDonors(prev => [...prev, ...data])
      } else {
        setDonors(data)
      }
      
      // If we get less than 10 items, there are no more donors
      setHasMore(data.length === 10)
      setLoading(false)
      setLoadingMore(false)
    } catch (err) {
      console.error("Error fetching donors:", err)
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchDonors(1, false)
  }, [])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      const nextPage = page + 1
      setPage(nextPage)
      fetchDonors(nextPage, true)
    }
  }

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
    navigate("/create-donor")
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
                    key={donor.user_id || index}
                    className="hover:bg-[#f8f9fc] transition-colors cursor-pointer"
                    onClick={() => handleRowClick(donor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{`${donor.first_name} ${donor.last_name}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{donor.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.BloodType?.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">{donor.phone_num}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.last_donation_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1d2433]">
                      {donor.expiry_date}
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

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-white-600 hover:bg-red-300 disabled:bg-gray-400 text-red-600 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Load More
                </>
              )}
            </button>
          </div>
        )}

        {/* No more data message */}
        {!hasMore && donors.length > 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p>All donors have been loaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
