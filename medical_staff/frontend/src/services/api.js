const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Appointment API functions
export const appointmentAPI = {
  // Get all appointments
  getAll: async (page = 1, limit = 10, status, search) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    console.log('API getAll called with params:', { page, limit, status, search });
    console.log('URL params:', params.toString());

    const response = await fetch(`${API_BASE_URL}/appointments?${params}`);
    return handleResponse(response);
  },

  // Get appointment by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
    return handleResponse(response);
  },

  // Create new appointment
  create: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },

  // Update appointment
  update: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Update appointment status
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Delete appointment
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get appointment statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/stats/overview`);
    return handleResponse(response);
  },
};

// Blood Request API functions
export const bloodRequestAPI = {
  // Get all blood requests
  getAll: async (page = 1, limit = 10, status, requestType, search) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (requestType) params.append('requestType', requestType);
    if (search) params.append('search', search);

    console.log('API bloodRequest getAll called with params:', { page, limit, status, requestType, search });
    console.log('URL params:', params.toString());

    const response = await fetch(`${API_BASE_URL}/blood-requests?${params}`);
    return handleResponse(response);
  },

  // Get blood request by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`);
    return handleResponse(response);
  },

  // Create new blood request
  create: async (bloodRequestData) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bloodRequestData),
    });
    return handleResponse(response);
  },

  // Update blood request
  update: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Update blood request status
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Delete blood request
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get blood request statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/stats/overview`);
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}; 