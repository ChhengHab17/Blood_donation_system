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