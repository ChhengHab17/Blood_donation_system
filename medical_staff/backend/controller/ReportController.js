import {getUsers,
        getBloodInventories,
        createRequest,
        getTotalVolumeByBloodTypeService,
        getTotalDonationCount,
        getTotalPendingRequestCount,
        getFilteredDonors,
        getFilteredBloodInventories,
        searchByName
      } from '../services/reportServices.js';

export const getUser = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const center_id = req.user.center_id;

  try {
    const result = await getUsers(limit, page, center_id);

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getBloodInventory = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const center_id = req.user.center_id;

  try {
    const result = await getBloodInventories(limit, page, center_id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching blood inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTotalVolumeByBloodType = async (req, res) => {
  const center_id = req.user.center_id;
  try {
    const result = await getTotalVolumeByBloodTypeService(center_id);
    res.json(result);
  } catch (error) {
    console.error('Error fetching total volume by blood type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const getTotalDonationCounts = async (req, res) => {
  const center_id = req.user.center_id;
  try {
    const count = await getTotalDonationCount(center_id);
    res.json({ totalDonationCount: count });
  } catch (error) {
    console.error('Error fetching total donation count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getPendingRequest = async (req, res) => {
  const center_id = req.user.center_id;
  try {
    const count = await getTotalPendingRequestCount(center_id);
    res.json({ totalPendingRequestCount: count });
  } catch (error) {
    console.error('Error fetching total pending request count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const filterDonors = async (req, res) => {
  const center_id = req.user.center_id;
  try {
    const filteredDonors = await getFilteredDonors({ ...req.body, center_id });
    res.json(filteredDonors);
  } catch (error) {
    console.error('Error filtering donors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const filterBloodInventory = async (req, res) => {
  const center_id = req.user.center_id;
  const { page = 1, limit = 10, bloodType, expiryFrom, expiryTo } = req.body;
  try {
    const result = await getFilteredBloodInventories({ page, limit, bloodType, expiryFrom, expiryTo, center_id });
    res.json(result);
  } catch (error) {
    console.error('Error filtering blood inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const createBloodRequest = async (req, res) => {
  const requestData = req.body;
  console.log('Controller received request data:', requestData);

  // Validate essential required fields
  const requiredFields = ['medicalStaffId', 'quantity_units', 'bloodType'];
  const missingFields = requiredFields.filter(field => !requestData[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  try {
    const result = await createRequest(requestData);
    res.json(result);
  } catch (error) {
    console.error('Error creating blood request:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
export const searchName = async (req, res) => {
  const searchQuery = req.query.name;
  
  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const result = await searchByName(searchQuery.trim());
    
    // Even if no results, return empty array instead of 404
    const formatted = result.map((staff) => ({
      id: staff.staff_id,
      name: `${staff.first_name} ${staff.last_name}`,
      first_name: staff.first_name,
      last_name: staff.last_name
    }));
    
    res.json({ data: formatted });
  } catch (error) {
    console.error('Error searching by name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
