import React, { useState, useEffect, useRef } from 'react';

const StatusDropdown = ({ bloodRequest, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Add null/undefined check for bloodRequest
  if (!bloodRequest) {
    return (
      <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-600 text-white border border-black w-[120px] flex items-center justify-between">
        Loading...
      </div>
    );
  }

  // Get status button styling
  const getStatusButtonClass = (status) => {
    const baseClass = "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center justify-between w-[120px] ";
    switch(status) {
      case 'Pending':
        return baseClass + "bg-yellow-600 text-white hover:bg-yellow-700";
      case 'Accepted':
        return baseClass + "bg-green-600 text-white hover:bg-green-700";
      case 'Rejected':
        return baseClass + "bg-red-600 text-white hover:bg-red-700";
      default:
        return baseClass + "bg-gray-600 text-white hover:bg-gray-700 border border-black";
    }
  };

  const handleStatusChange = (newStatus) => {
    console.log('handleStatusChange called with:', newStatus);
    console.log('bloodRequest:', bloodRequest);
    console.log('onStatusUpdate function:', onStatusUpdate);
    
    if (bloodRequest && bloodRequest.request_id) {
      console.log('Calling onStatusUpdate with:', bloodRequest.request_id, newStatus);
      onStatusUpdate(bloodRequest.request_id, newStatus);
    } else {
      console.log('No blood request ID found');
    }
    setIsOpen(false);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent row click
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e, newStatus) => {
    e.stopPropagation(); // Prevent row click
    console.log('Option clicked:', newStatus);
    handleStatusChange(newStatus);
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Pending':
        return 'Pending';
      case 'Accepted':
        return 'Accepted';
      case 'Rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  // Chevron down icon component
  const ChevronDownIcon = () => (
    <svg 
      className="w-3 h-3 flex-shrink-0" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 9l-7 7-7-7" 
      />
    </svg>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className={getStatusButtonClass(bloodRequest.status || 'Pending')}
      >
        <span className="flex-1 text-center">{getStatusText(bloodRequest.status || 'Pending')}</span>
        <ChevronDownIcon />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-[120px] flex flex-col">
          <button
            onClick={(e) => handleOptionClick(e, 'Pending')}
            className="w-full text-left px-4 py-3 hover:bg-yellow-50 text-yellow-700 rounded-t-lg text-sm font-medium border-b border-gray-100"
          >
            Pending
          </button>
          <button
            onClick={(e) => handleOptionClick(e, 'Accepted')}
            className="w-full text-left px-4 py-3 hover:bg-green-50 text-green-700 text-sm font-medium border-b border-gray-100"
          >
            Accepted
          </button>
          <button
            onClick={(e) => handleOptionClick(e, 'Rejected')}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 rounded-b-lg text-sm font-medium"
          >
            Rejected
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown; 