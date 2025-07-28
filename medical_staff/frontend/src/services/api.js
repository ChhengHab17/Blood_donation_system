import axios from 'axios';

// Axios interceptor to add JWT token to Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_URL = 'http://localhost:3000/api';

export const getUser = async (page = 1, limit = 10) => {
    try{
        const response = await axios.get(`${API_URL}/report/user`, {
            params: {
                page,
                limit
            }
        });
        return response.data;
    }catch(error){
        console.error('Error fetching user data:', error);
        throw error;
    }
}
export const getBloodInventory = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/report/blood-inventory`, {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blood inventory:', error);
        throw error;
    }
}
export const createBloodRequest = async (requestData) => {
    try {
        // Validate required fields
        const requiredFields = ['medicalStaffId', 'bloodType', 'quantity_units'];
        const missingFields = requiredFields.filter(field => !requestData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        const response = await axios.post(`${API_URL}/center-request`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error creating blood request:', error);
        throw error;
    }
}
export const getTotalVolumeByBloodType = async () => {
    try {
        const response = await axios.get(`${API_URL}/report/blood`);
        return response.data;
    } catch (error) {
        console.error('Error fetching total volume by blood type:', error);
        throw error;
    }
}
export const getTotalDonationCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/report/donation-count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching total donation count:', error);
        throw error;
    }
}
export const getPendingRequestCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/report/pending-request`);
        return response.data;
    } catch (error) {
        console.error('Error fetching total pending request count:', error);
        throw error;
    }
}
export const filterDonors = async ({ page = 1, limit = 10, ...filterData }) => {
    try {
        const response = await axios.post(`${API_URL}/report/filter-donors`, {
            page,
            limit,
            ...filterData
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering donors:', error);
        throw error;
    }
}
export const filterBloodInventory = async ({ page = 1, limit = 10, ...filterData }) => {
    try {
        const response = await axios.post(`${API_URL}/report/filter-blood-inventory`, {
            page,
            limit,
            ...filterData
        });
        return response.data;
    } catch (error) {
        console.error('Error filtering blood inventory:', error);
        throw error;
    }
}
export const searchName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/report/search-name`, {
            params: { name }
        });
        return response;
    } catch (error) {
        console.error('Error searching by name:', error);
        throw error;
    }
}
export const registerUser = async (firstName, lastName, email, phoneNumber, role, centerId, password, rePassword) => {
    try {
        const response = await axios.post(`http://localhost:3000/auth/register`, {
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            centerId,
            password,
            rePassword
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`http://localhost:3000/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const getDonationCenters = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/auth/donation-centers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching donation centers:', error);
        throw error;
    }
}
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
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await axios.get(`${API_URL}/appointments`, { params });
    return response.data;
  },

  // Get appointment by ID
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  create: async (appointmentData) => {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  },

  // Update appointment
  update: async (id, updateData) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, updateData);
    return response.data;
  },

  // Update appointment status
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
    return response.data;
  },

  // Delete appointment
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`);
    return response.data;
  },

  // Get appointment statistics
  getStats: async () => {
    const response = await axios.get(`${API_URL}/appointments/stats/overview`);
    return response.data;
  },
};

// Blood Request API functions
export const bloodRequestAPI = {
  // Get all blood requests
  getAll: async (page = 1, limit = 10, status, requestType, search) => {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (status) params.status = status;
    if (requestType) params.requestType = requestType;
    if (search) params.search = search;
    const response = await axios.get(`${API_URL}/blood-requests`, { params });
    return response.data;
  },

  // Get blood request by ID
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/blood-requests/${id}`);
    return response.data;
  },

  // Create new blood request
  create: async (bloodRequestData) => {
    const response = await axios.post(`${API_URL}/blood-requests`, bloodRequestData);
    return response.data;
  },

  // Update blood request
  update: async (id, updateData) => {
    const response = await axios.put(`${API_URL}/blood-requests/${id}`, updateData);
    return response.data;
  },

  // Update blood request status
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/blood-requests/${id}/status`, { status });
    return response.data;
  },

  // Delete blood request
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/blood-requests/${id}`);
    return response.data;
  },

  // Get blood request statistics
  getStats: async () => {
    const response = await axios.get(`${API_URL}/blood-requests/stats/overview`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
}; 