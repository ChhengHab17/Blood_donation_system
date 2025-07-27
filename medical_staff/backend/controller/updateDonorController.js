const db = require('../db');

// Helper: get blood_type_id from blood_type string
async function getBloodTypeId(bloodType) {
  const res = await db.query('SELECT type_id FROM blood_type WHERE type = $1', [bloodType]);
  if (res.rows.length === 0) {
    throw new Error('Invalid blood type');
  }
  return res.rows[0].type_id;
}

exports.updateDonor = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    gender,
    date_of_birth,
    email,
    phone_number,
    address,
    blood_type,
  } = req.body;

  if (!name || !gender || !date_of_birth || !email || !phone_number || !blood_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Split name into first and last (simple approach)
  const nameParts = name.trim().split(' ');
  const first_name = nameParts.shift();
  const last_name = nameParts.join(' ') || '';

  try {
    // Get blood_type_id
    const blood_type_id = await getBloodTypeId(blood_type);

    // Update query
    const query = `
      UPDATE users SET
        first_name = $1,
        last_name = $2,
        gender = $3,
        dob = $4,
        email = $5,
        phone_num = $6,
        address = $7,
        blood_type_id = $8
      WHERE user_id = $9
      RETURNING user_id
    `;

    const values = [
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      address,
      blood_type_id,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor updated successfully' });
  } catch (err) {
    console.error('Error updating donor:', err);
    res.status(500).json({ error: 'Failed to update donor' });
  }
};
