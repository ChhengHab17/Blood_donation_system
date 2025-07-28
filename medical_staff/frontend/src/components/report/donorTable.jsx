import { useEffect, useState, useRef, useCallback } from "react";
import { getUser, filterDonors } from "../../services/api";
import { exportToCSV } from "../../utils/exportCSV";
import { FilterButton } from "./filterButton";


export default function DonorTable() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const fetchDonorData = async (pageNumber, filter = null) => {
    try {
      setLoading(true);
      let response;
      
      if (filter) {
        response = await filterDonors({
          ...filter,
          page: pageNumber,
          limit: ITEMS_PER_PAGE
        });
      } else {
        response = await getUser(pageNumber, ITEMS_PER_PAGE);
      }

      const newDonors = response.data;
      setTotalPages(response.meta.totalPages);
      
      if (pageNumber === 1) {
        setDonors(newDonors);
      } else {
        setDonors(prevDonors => [...prevDonors, ...newDonors]);
      }
      
      setHasMore(newDonors.length === ITEMS_PER_PAGE && pageNumber < response.meta.totalPages);
      console.log("Donors fetched successfully:", response.data);
      
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page or filter changes
  useEffect(() => {
    fetchDonorData(page, activeFilter);
  }, [page, activeFilter]);

  const handleFilterApply = (filter) => {
    if (!filter) {
      setActiveFilter(null);
      setPage(1);
      setDonors([]);
      return;
    }

    let formattedFilter = {};
    if (filter.filterBy === 'bloodType' && filter.value) {
      formattedFilter = {
        blood_type: filter.value
      };
    } else if (filter.filterBy === 'donationDate' && filter.value) {
      formattedFilter = {
        date_from: filter.value.from,
        date_to: filter.value.to
      };
    }

    setActiveFilter(formattedFilter);
    setPage(1); // Reset to first page when filter changes
    setDonors([]); // Clear current donors
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex justify-between items-center px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Donor Table</h2>
        <FilterButton onApply={handleFilterApply} />
      </div>
      {loading && donors.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.User ? donor.User.user_id : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.User ? `${donor.User.first_name} ${donor.User.last_name}` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.User && donor.User.BloodType ? donor.User.BloodType.type : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.volume}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donor.MedicalStaff ? `${donor.MedicalStaff.first_name} ${donor.MedicalStaff.last_name}` : '-'}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <span className="text-gray-500">Loading more...</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => exportToCSV(donors, 'donor_records.csv')}
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Export CSV
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
            </div>
            {hasMore && !loading && (
              <button 
                onClick={() => setPage(prev => prev + 1)}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Load more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
