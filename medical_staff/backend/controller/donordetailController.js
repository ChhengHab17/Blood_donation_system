// controller/donorDetailController.js
const db = require("../db");

exports.getDonorDetails = async (req, res) => {
  const donorId = parseInt(req.params.id, 10);
  if (isNaN(donorId)) return res.status(400).json({ error: "Invalid donor ID" });

  try {
    // Basic donor info + blood type (join blood_type)
    const donorSql = `
      SELECT 
        u.user_id,
        u.first_name || ' ' || u.last_name AS name,
        u.email,
        u.phone_num AS phone_number,
        u.address,
        u.DoB AS date_of_birth,
        u.gender::text,
        bt.type AS blood_type,
        u.last_donation_date
      FROM users u
      LEFT JOIN blood_type bt ON u.blood_type_id = bt.type_id
      WHERE u.user_id = $1
    `;
    const { rows: donorRows } = await db.query(donorSql, [donorId]);
    if (donorRows.length === 0) {
      return res.status(404).json({ error: "Donor not found" });
    }
    const donor_info = donorRows[0];

    // Eligibility record (latest check)
    const eligibilitySql = `
      SELECT is_eligible, check_date, hemoglobin_level, blood_pressure, weight
      FROM eligibility_record
      WHERE user_id = $1
      ORDER BY check_date DESC
      LIMIT 1
    `;
    const { rows: eligibilityRows } = await db.query(eligibilitySql, [donorId]);
    const eligibility_record = eligibilityRows[0] || null;

    // Appointments (last 5)
    const appointmentsSql = `
      SELECT 
        DATE(a.date_time) AS appointment_date,
        TO_CHAR(a.date_time, 'HH24:MI') AS appointment_time,
        a.status::text,
        dc.name AS donation_center_name
      FROM appointment a
      JOIN donation_center dc ON a.center_id = dc.center_id
      WHERE a.user_id = $1
      ORDER BY a.date_time DESC
      LIMIT 5
    `;
    const { rows: appointments } = await db.query(appointmentsSql, [donorId]);

    // Donation history (all)
    const donationHistorySql = `
      SELECT
        dr.date AS donation_date,
        dr.volume AS volume_donated,
        dr.status::text AS donation_status,
        ms.first_name || ' ' || ms.last_name AS staff_name,
        dc.name AS donation_center_name
      FROM donation_record dr
      LEFT JOIN medical_staff ms ON dr.staff_id = ms.staff_id
      LEFT JOIN donation_center dc ON dr.center_id = dc.center_id
      WHERE dr.user_id = $1
      ORDER BY dr.date DESC
    `;
    const { rows: donation_history } = await db.query(donationHistorySql, [donorId]);

    // Blood requests (last 5)
    const bloodRequestSql = `
      SELECT 
        br.request_date,
        br.quantity_units AS quantity_requested,
        br.status::text AS request_status,
        ms.first_name || ' ' || ms.last_name AS staff_name
      FROM blood_request br
      LEFT JOIN medical_staff ms ON br.staff_id = ms.staff_id
      WHERE br.user_id = $1
      ORDER BY br.request_date DESC
      LIMIT 5
    `;
    const { rows: blood_requests } = await db.query(bloodRequestSql, [donorId]);

    res.json({
      donor_info,
      eligibility_record,
      appointments,
      donation_history,
      blood_requests,
    });
  } catch (error) {
    console.error("Error fetching donor details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
