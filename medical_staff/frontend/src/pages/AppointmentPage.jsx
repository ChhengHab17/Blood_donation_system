import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import SearchFilter from '../components/appointment/search_filter';
import AppointmentsTable from '../components/appointment/appointment_table';
import AppointmentDetailModal from '../components/appointment/appointment_detail_modal';
import { appointmentAPI } from '../services/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusFilter = filter === 'All' ? null : filter;
      const response = await appointmentAPI.getAll(
        pagination.currentPage, 
        pagination.itemsPerPage, 
        statusFilter, 
        searchTerm
      );
      
      // Transform backend data to match frontend format
      const transformedAppointments = response.appointments.map(appointment => ({
        id: appointment.appointment_id,
        name: `${appointment.first_name || ''} ${appointment.last_name || ''}`.trim(),
        date: new Date(appointment.date_time).toLocaleDateString('en-GB'),
        gender: appointment.gender || 'N/A',
        dob: appointment.DoB ? new Date(appointment.DoB).toLocaleDateString('en-GB') : 'N/A',
        bloodType: appointment.blood_type || 'N/A',
        status: appointment.status || 'no status',
        // Keep original data for API calls
        originalData: appointment
      }));

      setAppointments(transformedAppointments);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
      // Fallback to sample data if API fails
      setAppointments([
        {
          id: 'A-1000',
          name: 'John Doe',
          date: '20-07-2025',
          gender: 'Male',
          dob: '12-05-2000',
          bloodType: 'A',
          status: 'no status'
        },
        {
          id: 'A-1001',
          name: 'Sarah Johnson',
          date: '21-07-2025',
          gender: 'Female',
          dob: '15-08-1995',
          bloodType: 'O+',
          status: 'approved'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load appointments on component mount and when filters change
  useEffect(() => {
    fetchAppointments();
  }, [filter, searchTerm, pagination.currentPage]);

  // Update appointment status
  const updateStatus = async (id, newStatus) => {
    try {
      console.log('Updating status for appointment:', id, 'to:', newStatus);
      
      // Find the appointment to get the original data
      const appointment = appointments.find(app => app.id === id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Call the API to update status
      await appointmentAPI.updateStatus(id, newStatus);
      
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      
      console.log('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Handle search change
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // Handle appointment click to open modal
  const handleAppointmentClick = (appointment) => {
    console.log('Appointment clicked:', appointment);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Handle status change in modal
  const handleModalStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      // Update the selected appointment status in modal
      setSelectedAppointment(prev => 
        prev ? { ...prev, status: newStatus } : null
      );
    } catch (error) {
      console.error('Error updating status in modal:', error);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <Layout title="Appointments">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading appointments...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Appointments">
      {/* All Appointments Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        totalAppointments={pagination.totalItems}
        filteredCount={appointments.length}
      />

      {/* Appointments Table */}
      <AppointmentsTable
        appointments={appointments}
        onStatusChange={updateStatus}
        onAppointmentClick={handleAppointmentClick}
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
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStatusChange={handleModalStatusChange}
      />
    </Layout>
  );
}