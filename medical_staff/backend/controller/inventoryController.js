const db = require('../db');

exports.getInventory = async (req, res) => {
  const query = `
    SELECT b.blood_id,
           bt.type AS blood_type,
           bi.quantity_units AS quantity,
           b.collected_date AS donation_date,
           b.expiry_date
    FROM blood_inventory bi
    JOIN blood b ON bi.blood_id = b.blood_id
    JOIN blood_type bt ON b.blood_type_id = bt.type_id
  `;

  try {
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
