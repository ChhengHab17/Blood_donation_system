import React from 'react';
import { Search, Funnel } from 'lucide-react';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filter, 
  onFilterChange, 
  totalAppointments, 
  filteredCount 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Funnel className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No show">No Show</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalAppointments} appointments
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;