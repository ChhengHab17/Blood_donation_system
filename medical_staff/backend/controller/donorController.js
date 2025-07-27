const pool = require('../db'); // Your PostgreSQL pool instance

exports.getDonors = async (req, res) => {
  const sql = `
    SELECT
      u.user_id,
      u.first_name || ' ' || u.last_name AS name,
      u.gender,
      bt.type AS blood_type,
      u.phone_num AS contact,
      u.last_donation_date AS donation_date,
      (u.last_donation_date + INTERVAL '1 month') AS expiry_date
    FROM users u
    LEFT JOIN blood_type bt ON u.blood_type_id = bt.type_id
  `;

  try {
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching donors:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getDonorDetailsById = async (req, res) => {
  const donorId = req.params.id;

  try {
    const donorSql = `
      SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_num,
        u.address,
        u.DoB,
        u.gender,
        u.create_at,
        d.blood_type,
        d.weight,
        d.hemoglobin_level,
        d.blood_pressure,
        d.is_eligible,
        d.check_date,
        (
          SELECT MAX(donation_date) FROM donations WHERE donor_id = $1
        ) AS last_donation_date,
        (
          SELECT COUNT(*) FROM donations WHERE donor_id = $1
        ) AS total_donations,
        (
          SELECT volume FROM donations WHERE donor_id = $1 ORDER BY donation_date DESC LIMIT 1
        ) AS last_volume,
        (
          SELECT status FROM donations WHERE donor_id = $1 ORDER BY donation_date DESC LIMIT 1
        ) AS last_donation_status
      FROM users u
      JOIN donors d ON u.id = d.user_id
      WHERE u.id = $1
    `;

    const appointmentsSql = `
      SELECT
        a.date_time,
        a.status,
        c.name AS center_name
      FROM appointments a
      JOIN donation_centers c ON a.center_id = c.id
      WHERE a.user_id = $1
      ORDER BY a.date_time DESC
      LIMIT 5
    `;

    const bloodRequestsSql = `
      SELECT
        br.request_date,
        br.quantity_units,
        br.status,
        s.name AS staff_name
      FROM blood_requests br
      LEFT JOIN staff s ON br.staff_id = s.id
      WHERE br.user_id = $1
      ORDER BY br.request_date DESC
      LIMIT 5
    `;

    const { rows: donorRows } = await pool.query(donorSql, [donorId]);
    const donor = donorRows[0];

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    const { rows: appointments } = await pool.query(appointmentsSql, [donorId]);
    const { rows: bloodRequests } = await pool.query(bloodRequestsSql, [donorId]);

    res.json({
      ...donor,
      appointments,
      blood_requests: bloodRequests,
    });

  } catch (error) {
    console.error('Error fetching donor details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
