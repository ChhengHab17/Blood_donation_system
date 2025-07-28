import React from 'react';
import StatusDropdown from './status';

const BloodRequestDetailModal = ({ bloodRequest, isOpen, onClose, onStatusChange, requestType }) => {
  if (!isOpen || !bloodRequest) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Blood Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Request ID */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Blood Request #{bloodRequest.request_id}
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Status:</span>
              <StatusDropdown
                bloodRequest={bloodRequest}
                onStatusUpdate={onStatusChange}
              />
            </div>
          </div>

          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {requestType === 'user' ? 'Patient Information' : 'Center Information'}
              </h4>
              <div className="space-y-2">
                {requestType === 'user' ? (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Full Name:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                      <p className="text-sm text-gray-900">{formatDateOnly(bloodRequest.dob)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact Number:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.contact_num}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Center Name:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.center_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact Number:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.center_contact}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Address:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.center_address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">City:</span>
                      <p className="text-sm text-gray-900">{bloodRequest.center_city}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Request Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Request Type:</span>
                  <p className="text-sm text-gray-900 capitalize">{requestType === 'user' ? 'Patient' : 'Center'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Blood Type:</span>
                  <p className="text-sm text-gray-900">{bloodRequest.blood_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Quantity Requested:</span>
                  <p className="text-sm text-gray-900">{bloodRequest.quantity} units</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date Requested:</span>
                  <p className="text-sm text-gray-900">{formatDate(bloodRequest.date_request)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Request ID:</span>
                  <p className="text-sm text-gray-900">{bloodRequest.request_id}</p>
                </div>
                {requestType === 'user' && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">User ID:</span>
                    <p className="text-sm text-gray-900">{bloodRequest.user_id}</p>
                  </div>
                )}
                {requestType === 'center' && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Center ID:</span>
                    <p className="text-sm text-gray-900">{bloodRequest.center_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Reason */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Request Reason</h4>
            <p className="text-sm text-gray-700">
              {bloodRequest.user_reason || 'No reason provided'}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">
              This is a blood request for {bloodRequest.quantity} units of {bloodRequest.blood_type} blood. 
              Please review the request details and update the status accordingly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetailModal; 