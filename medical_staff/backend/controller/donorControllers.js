import { createDonorService, deleteDonorService, getAllDonorsService, getDonorDetailsByIdService, getDonorDetailsService, updateDonorService } from '../services/donorServices.js';

export const getDonors = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const center_id = req.user.center_id;
      
      const donors = await getAllDonorsService(limit, offset, center_id);

      const donorsWithExpiry = donors.map(donor => {
        const expiryDate = new Date(donor.last_donation_date);
        expiryDate.setDate(expiryDate.getDate() + 90);
        return {
          ...donor,
          expiry_date: expiryDate.toISOString().split('T')[0], // optional formatting
        };
      });

      res.json(donorsWithExpiry);
    } catch (err) {
      console.error('Error fetching donors:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  export const getDonorDetailsById = async (req, res) => {
    const donorId = req.params.id;
    try {
      const details = await getDonorDetailsByIdService(donorId);
      if (!details) {
        return res.status(404).json({ error: 'Donor not found' });
      }
      res.json(details);
    } catch (error) {
      console.error('Error fetching donor details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const getDonorDetails = async (req, res) => {
    const donorId = parseInt(req.params.id, 10);
    if (isNaN(donorId)) return res.status(400).json({ error: 'Invalid donor ID' });
    try {
      const details = await getDonorDetailsService(donorId);
      if (!details) {
        return res.status(404).json({ error: 'Donor not found' });
      }
      res.json(details);
    } catch (error) {
      console.error('Error fetching donor details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const createDonor = async (req, res) => {
  try {
    // Get staff_id and center_id from the logged-in user (req.user)
    const staff_id = req.user && req.user.staff_id;
    const center_id = req.user && req.user.center_id;
    if (!staff_id || !center_id) {
      return res.status(400).json({ error: 'Missing staff or center information from token.' });
    }
    const result = await createDonorService(req.body, staff_id, center_id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating donor:', error.message);
    res.status(500).json({ error: 'Failed to create donor' });
  }
};
export const deleteDonor = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await deleteDonorService(id);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === 'Donor not found') {
        return res.status(404).json({ error: err.message });
      }
      console.error('Error deleting donor:', err);
      res.status(500).json({ error: 'Failed to delete donor' });
    }
  };
  export const updateDonor = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await updateDonorService(id, req.body);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === 'Donor not found') {
        return res.status(404).json({ error: err.message });
      }
      if (err.message === 'Invalid blood type' || err.message === 'Missing required fields') {
        return res.status(400).json({ error: err.message });
      }
      console.error('Error updating donor:', err);
      res.status(500).json({ error: 'Failed to update donor' });
    }
  };
  