import { useEffect, useState } from "react";
import { getBloodInventory } from "../../services/api";
import { exportToCSV } from "../../utils/exportCSV";
import { FilterButton } from "./filterButton";
import { filterBloodInventory } from "../../services/api";

export default function InventoryTable() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const fetchInventoryData = async (pageNumber, filter = null) => {
    try {
      setLoading(true);
      let response;
      if (filter) {
        response = await filterBloodInventory({
          ...filter,
          page: pageNumber,
          limit: ITEMS_PER_PAGE
        });
      } else {
        response = await getBloodInventory(pageNumber, ITEMS_PER_PAGE);
      }
      const newInventory = response.data;
      setTotalPages(response.meta.totalPages);
      if (pageNumber === 1) {
        setInventoryData(newInventory);
      } else {
        setInventoryData(prevData => [...prevData, ...newInventory]);
      }
      setHasMore(newInventory.length === ITEMS_PER_PAGE && pageNumber < response.meta.totalPages);
      console.log("Inventory fetched successfully:", response.data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData(page, activeFilter);
  }, [page, activeFilter]);

  // Listen for inventory refresh events
  useEffect(() => {
    const handleInventoryRefresh = () => {
      refreshInventory();
    };

    window.addEventListener('inventoryRefresh', handleInventoryRefresh);

    return () => {
      window.removeEventListener('inventoryRefresh', handleInventoryRefresh);
    };
  }, []);

  const handleFilterApply = (filter) => {
    if (!filter) {
      setActiveFilter(null);
      setPage(1);
      setInventoryData([]);
      return;
    }
    let formattedFilter = {};
    if (filter.filterBy === 'bloodType' && filter.value) {
      formattedFilter = {
        bloodType: filter.value
      };
    } else if (filter.filterBy === 'donationDate' && filter.value) {
      formattedFilter = {
        expiryFrom: filter.value.from,
        expiryTo: filter.value.to
      };
    }
    setActiveFilter(formattedFilter);
    setPage(1);
    setInventoryData([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 ml-4 mt-4">Inventory Table</h2>
      <div className="flex justify-end px-4 py-2">
        <FilterButton onApply={handleFilterApply} />
      </div>
      {loading && inventoryData.length === 0 ? (
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
                    Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit In Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Blood.BloodType.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.quantity_units}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.Blood.expiry_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.total_volume}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
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
                onClick={() => exportToCSV(inventoryData, 'blood_inventory.csv')}
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
