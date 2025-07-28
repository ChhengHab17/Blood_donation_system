import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function InventoryTable1() {
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  const fetchInventory = async (pageNum = 1, append = false) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3000/api/inventory?page=${pageNum}&limit=10`)
      const data = response.data
      
      console.log('Inventory data:', data) // Debug log
      
      if (append) {
        setInventoryData(prev => [...prev, ...data])
      } else {
        setInventoryData(data)
      }
      
      // If we get less than 10 items, there are no more inventory items
      setHasMore(data.length === 10)
      setLoading(false)
      setLoadingMore(false)
    } catch (err) {
      console.error('Error fetching inventory data:', err)
      setError(err.message)
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchInventory(1, false)
  }, [])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      const nextPage = page + 1
      setPage(nextPage)
      fetchInventory(nextPage, true)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="p-8 bg-[#f8f9fc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500">Loading inventory data...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error && page === 1) {
    return (
      <div className="p-8 bg-[#f8f9fc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500">Error loading inventory: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-[#f8f9fc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#000000] mb-6">Blood Inventory</h1>

        <div className="bg-[#ffffff] rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f1f3f9] border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Blood ID</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Blood Type</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Quantity</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Collection Date</th>
                <th className="text-left py-4 px-6 font-medium text-[#1d2433]">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                    No inventory data available.
                  </td>
                </tr>
              ) : (
                inventoryData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#f8f9fc]"}>
                    <td className="py-4 px-6 text-[#000000]">{item.Blood?.blood_id || 'N/A'}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.Blood?.BloodType?.type || 'N/A'}</td>
                    <td className="py-4 px-6 text-[#000000]">{item.quantity_units || 'N/A'}</td>
                    <td className="py-4 px-6 text-[#000000]">
                      {item.Blood?.collected_date ? new Date(item.Blood.collected_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-[#000000]">
                      {item.Blood?.expiry_date ? new Date(item.Blood.expiry_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
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
        {!hasMore && inventoryData.length > 0 && (
          <div className="mt-6 text-center text-gray-500">
            <p>All inventory items have been loaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
