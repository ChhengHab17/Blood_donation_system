import { getInventoryService } from '../services/inventoryServices.js';

export const getInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const center_id = req.user.center_id;
    
    const inventory = await getInventoryService(limit, offset, center_id);
    res.json(inventory);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
