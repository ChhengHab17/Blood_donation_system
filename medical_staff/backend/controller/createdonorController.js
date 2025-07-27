const pool = require('../db'); // Your PostgreSQL connection pool

exports.createDonor = async (req, res) => {
  const {
    first_name,
    last_name,
    password,
    gender,
    DoB,
    blood_type_id,
    address,
    phone_num,
    email,
    last_donation_date,
    // Eligibility info:
    is_eligible,
    check_date,
    hemoglobin_level,
    blood_pressure,
    weight
  } = req.body;

  try {
    await pool.query('BEGIN'); // Start DB transaction

    // Step 1: Insert into users table
    const insertUserQuery = `
      INSERT INTO users (
        first_name, last_name, password, gender, dob,
        blood_type_id, address, phone_num, email, last_donation_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING user_id
    `;

    const userResult = await pool.query(insertUserQuery, [
      first_name,
      last_name,
      password,
      gender,
      DoB,
      blood_type_id,
      address,
      phone_num,
      email,
      last_donation_date
    ]);

    const userId = userResult.rows[0].user_id;

    await pool.query('COMMIT'); // Commit DB transaction

    res.status(201).json({
      message: 'Donor created successfully',
      user_id: userId
    });

  } catch (error) {
    await pool.query('ROLLBACK'); // Roll back on error
    console.error('Error creating donor:', error.message);
    res.status(500).json({ error: 'Failed to create donor' });
  }
};
