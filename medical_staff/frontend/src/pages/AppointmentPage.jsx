import React, { useState } from 'react';
import Layout from '../components/layout';
import SearchFilter from '../components/appointment/search_filter';
import AppointmentsTable from '../components/appointment/appointment_table';

export default function AppointmentsPage() {
  // Sample appointment data
  const [appointments, setAppointments] = useState([
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
    },
    {
      id: 'A-1002',
      name: 'Michael Chen',
      date: '22-07-2025',
      gender: 'Male',
      dob: '03-12-1988',
      bloodType: 'B+',
      status: 'not approved'
    },
    {
      id: 'A-1003',
      name: 'Emma Wilson',
      date: '23-07-2025',
      gender: 'Female',
      dob: '28-02-1992',
      bloodType: 'AB-',
      status: 'no status'
    },
    {
      id: 'A-1004',
      name: 'David Rodriguez',
      date: '24-07-2025',
      gender: 'Male',
      dob: '10-11-1985',
      bloodType: 'O-',
      status: 'approved'
    },
    {
      id: 'A-1005',
      name: 'Lisa Anderson',
      date: '25-07-2025',
      gender: 'Female',
      dob: '07-04-1990',
      bloodType: 'A+',
      status: 'not approved'
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Update appointment status
  const updateStatus = (id, newStatus) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'All' || appointment.status === filter.toLowerCase();
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout title="Appointments">
      {/* All Appointments Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
          <div className="text-sm text-gray-600">
            All
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        totalAppointments={appointments.length}
        filteredCount={filteredAppointments.length}
      />

      {/* Appointments Table */}
      <AppointmentsTable
        appointments={filteredAppointments}
        onStatusUpdate={updateStatus}
      />
    </Layout>
  );
}