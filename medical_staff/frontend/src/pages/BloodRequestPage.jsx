import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import BloodRequestTable from '../components/bloodRequest/blood_request_table';
import SearchFilter from '../components/bloodRequest/search_filter';
import BloodRequestDetailModal from '../components/bloodRequest/blood_request_detail_modal';
import { bloodRequestAPI } from '../services/api';

const BloodRequestPage = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'center'
  const [selectedBloodRequest, setSelectedBloodRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusFilterValue = statusFilter === 'All' ? null : statusFilter;
      const response = await bloodRequestAPI.getAll(
        pagination.currentPage, 
        pagination.itemsPerPage, 
        statusFilterValue, 
        activeTab, 
        searchTerm
      );
      
      setBloodRequests(response.bloodRequests);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      setError('Failed to get blood requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, [pagination.currentPage, statusFilter, activeTab, searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      console.log('Updating blood request status:', requestId, newStatus);
      await bloodRequestAPI.updateStatus(requestId, newStatus);
      
      // Update the local state
      setBloodRequests(prev => 
        prev.map(request => 
          request.request_id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      // If modal is open, update the selected blood request
      if (selectedBloodRequest && selectedBloodRequest.request_id === requestId) {
        setSelectedBloodRequest(prev => ({ ...prev, status: newStatus }));
      }
      
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update status: ' + error.message);
    }
  };

  const handleBloodRequestClick = (bloodRequest) => {
    console.log('Blood request clicked:', bloodRequest);
    setSelectedBloodRequest(bloodRequest);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBloodRequest(null);
  };

  const handleModalStatusChange = async (requestId, newStatus) => {
    await updateStatus(requestId, newStatus);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading && bloodRequests.length === 0) {
    return (
      <Layout title="Blood Request">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading blood requests...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Blood Request">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Blood Request">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleTabChange('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'user'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Request
          </button>
          <button
            onClick={() => handleTabChange('center')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'center'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Center Request
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={statusFilter}
        onFilterChange={handleFilterChange}
        totalBloodRequests={pagination.totalItems}
        filteredCount={bloodRequests.length}
      />

      {/* Blood Request Table */}
      <BloodRequestTable
        bloodRequests={bloodRequests}
        onStatusChange={updateStatus}
        onBloodRequestClick={handleBloodRequestClick}
        requestType={activeTab}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <BloodRequestDetailModal
        bloodRequest={selectedBloodRequest}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStatusChange={handleModalStatusChange}
        requestType={activeTab}
      />
    </Layout>
  );
};

export default BloodRequestPage; 