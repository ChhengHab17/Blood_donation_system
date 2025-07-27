import React, { useState } from 'react';

const StatusDropdown = ({ appointment, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get status button styling
  const getStatusButtonClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ";
    switch(status) {
      case 'approved':
        return baseClass + "bg-green-100 text-green-800 hover:bg-green-200";
      case 'not approved':
        return baseClass + "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return baseClass + "bg-gray-100 text-gray-600 hover:bg-gray-200";
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(appointment.id, newStatus);
    setIsOpen(false);
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved':
        return 'Approved';
      case 'not approved':
        return 'Not Approved';
      default:
        return 'No Status';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getStatusButtonClass(appointment.status)}
      >
        {getStatusText(appointment.status)}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
          <button
            onClick={() => handleStatusChange('approved')}
            className="w-full text-left px-3 py-2 hover:bg-green-50 text-green-700 rounded-t-lg"
          >
            Approved
          </button>
          <button
            onClick={() => handleStatusChange('not approved')}
            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-700"
          >
            Not Approved
          </button>
          <button
            onClick={() => handleStatusChange('no status')}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-b-lg"
          >
            No Status
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;