import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { pathToFileURL } from 'url';

dotenv.config();

const { Client } = pg;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'blood_donation_system';
const DB_ADMIN_NAME = process.env.DB_ADMIN_NAME || 'postgres';
const DB_CREATE_IF_MISSING = (process.env.DB_CREATE_IF_MISSING ?? 'true').toLowerCase() === 'true';
const DB_INIT_LOCK_KEY = process.env.DB_INIT_LOCK_KEY || 'blood_donation_system_init_lock';

const isValidIdentifier = (value) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);

const createClient = (database) => new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database,
  ssl: { rejectUnauthorized: false }
});

const createEnumIfNotExists = async (client, enumName, values) => {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = '${enumName}'
          AND n.nspname = 'public'
      ) THEN
        CREATE TYPE ${enumName} AS ENUM (${values.map((value) => `'${value}'`).join(', ')});
      END IF;
    END $$;
  `);
};

const createSchema = async (client) => {
  await createEnumIfNotExists(client, 'gender', ['Male', 'Female', 'Other']);
  await createEnumIfNotExists(client, 'appointment_status', ['Scheduled', 'Completed', 'Cancelled', 'No show']);
  await createEnumIfNotExists(client, 'donation_status', ['Accepted', 'Rejected', 'Pending']);
  await createEnumIfNotExists(client, 'inventory_status', ['Available', 'Used', 'Expired', 'In Transit']);

  await client.query(`
    CREATE TABLE IF NOT EXISTS blood_type (
      type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      type VARCHAR(3) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS donation_center (
      center_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100),
      contact_num VARCHAR(20) NOT NULL,
      email VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      gender gender NOT NULL,
      dob DATE NOT NULL,
      blood_type_id INT REFERENCES blood_type(type_id) ON DELETE CASCADE,
      address TEXT,
      phone_num VARCHAR(20) NOT NULL,
      email VARCHAR(50) NOT NULL,
      last_donation_date DATE NOT NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS medical_staff (
      staff_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      first_name VARCHAR(20) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(50) NOT NULL,
      role VARCHAR(50),
      phone_num VARCHAR(20) NOT NULL,
      center_id INT REFERENCES donation_center(center_id)
    );

    CREATE TABLE IF NOT EXISTS eligibility_record (
      eligibility_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      is_eligible BOOLEAN DEFAULT FALSE,
      check_date DATE NOT NULL,
      hemoglobin_level FLOAT NOT NULL,
      blood_pressure VARCHAR(20) NOT NULL,
      weight FLOAT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointment (
      appointment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      center_id INT REFERENCES donation_center(center_id) ON DELETE CASCADE,
      date_time TIMESTAMP NOT NULL,
      status appointment_status NOT NULL
    );

    CREATE TABLE IF NOT EXISTS donation_record (
      donation_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      staff_id INT REFERENCES medical_staff(staff_id) ON DELETE SET NULL,
      center_id INT REFERENCES donation_center(center_id) ON DELETE CASCADE,
      date DATE NOT NULL,
      volume INT NOT NULL,
      status donation_status NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blood (
      blood_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      donation_id INT REFERENCES donation_record(donation_id) ON DELETE CASCADE,
      blood_type_id INT REFERENCES blood_type(type_id),
      volume INT NOT NULL,
      collected_date DATE NOT NULL,
      expiry_date DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blood_inventory (
      inventory_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      quantity_units INT NOT NULL,
      last_update DATE NOT NULL,
      blood_id INT REFERENCES blood(blood_id) ON DELETE CASCADE,
      center_id INT REFERENCES donation_center(center_id) ON DELETE CASCADE,
      status inventory_status NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blood_request (
      request_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      quantity_units INT NOT NULL,
      request_date DATE NOT NULL,
      status donation_status NOT NULL,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      staff_id INT REFERENCES medical_staff(staff_id) ON DELETE CASCADE,
      blood_type_id INT REFERENCES blood_type(type_id)
    );
  `);

  // Keep backward compatibility if blood_request already exists without blood_type_id.
  await client.query('ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS blood_type_id INT;');

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'blood_request_blood_type_id_fkey'
      ) THEN
        ALTER TABLE blood_request
        ADD CONSTRAINT blood_request_blood_type_id_fkey
        FOREIGN KEY (blood_type_id) REFERENCES blood_type(type_id);
      END IF;
    END $$;
  `);
};

const seedData = async (client) => {
  await client.query(`
    INSERT INTO blood_type (type)
    VALUES
      ('A+'), ('A-'), ('B+'), ('B-'), ('AB+'), ('AB-'), ('O+'), ('O-')
    ON CONFLICT (type) DO NOTHING;
  `);

  const donationCenterCount = await client.query('SELECT COUNT(*)::INT AS count FROM donation_center;');
  if (donationCenterCount.rows[0].count === 0) {
    await client.query(`
      INSERT INTO donation_center (name, address, city, contact_num, email)
      VALUES
        ('National Blood Center', 'Street 271, Sangkat Boeung Keng Kang', 'Phnom Penh', '+85523999111', 'national.center@blood.org'),
        ('Siem Reap Donation Hub', 'National Road 6, Svay Dangkum', 'Siem Reap', '+85563988111', 'siemreap.hub@blood.org'),
        ('Battambang Community Center', 'Street 1.5, Svay Por', 'Battambang', '+85553977111', 'battambang.center@blood.org');
    `);
  }

  const bloodTypeRows = await client.query('SELECT type_id, type FROM blood_type;');
  const centerRows = await client.query('SELECT center_id FROM donation_center ORDER BY center_id;');

  const bloodTypeMap = Object.fromEntries(bloodTypeRows.rows.map((row) => [row.type, row.type_id]));
  const centerId = centerRows.rows[0]?.center_id ?? null;

  const usersCount = await client.query('SELECT COUNT(*)::INT AS count FROM users;');
  if (usersCount.rows[0].count === 0) {
    const donorPassword = await bcrypt.hash('Donor@123', 10);

    await client.query(
      `
        INSERT INTO users (
          first_name, last_name, password, gender, dob, blood_type_id, address, phone_num, email, last_donation_date
        )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
          ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
          ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30),
          ($31, $32, $33, $34, $35, $36, $37, $38, $39, $40)
      `,
      [
        'Sokha', 'Cheng', donorPassword, 'Male', '1995-02-10', bloodTypeMap['A+'], 'Phnom Penh', '+85512300111', 'sokha@example.com', '2025-11-20',
        'Dara', 'Seng', donorPassword, 'Female', '1998-06-14', bloodTypeMap['O+'], 'Siem Reap', '+85512300222', 'dara@example.com', '2026-01-15',
        'Nika', 'Ly', donorPassword, 'Female', '1993-09-01', bloodTypeMap['B+'], 'Battambang', '+85512300333', 'nika@example.com', '2025-12-05',
        'Rith', 'Kim', donorPassword, 'Other', '2000-03-19', bloodTypeMap['AB-'], 'Phnom Penh', '+85512300444', 'rith@example.com', '2026-02-01'
      ]
    );
  }

  const staffCount = await client.query('SELECT COUNT(*)::INT AS count FROM medical_staff;');
  if (staffCount.rows[0].count === 0 && centerId) {
    const staffPassword = await bcrypt.hash(process.env.DEFAULT_STAFF_PASSWORD || 'Admin@123', 10);

    await client.query(
      `
        INSERT INTO medical_staff (first_name, last_name, password, email, role, phone_num, center_id)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7),
          ($8, $9, $10, $11, $12, $13, $14)
      `,
      [
        'Admin', 'User', staffPassword, 'admin@blood.org', 'Admin', '+855966660001', centerId,
        'Mony', 'Chan', staffPassword, 'staff@blood.org', 'Nurse', '+855966660002', centerId
      ]
    );
  }

  const userRows = await client.query('SELECT user_id, blood_type_id FROM users ORDER BY user_id;');
  const staffRows = await client.query('SELECT staff_id, center_id FROM medical_staff ORDER BY staff_id;');

  const eligibilityCount = await client.query('SELECT COUNT(*)::INT AS count FROM eligibility_record;');
  if (eligibilityCount.rows[0].count === 0 && userRows.rows.length > 0) {
    const eligibilityInserts = userRows.rows.slice(0, 3);
    for (const user of eligibilityInserts) {
      await client.query(
        `
          INSERT INTO eligibility_record (user_id, is_eligible, check_date, hemoglobin_level, blood_pressure, weight)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [user.user_id, true, '2026-04-01', 13.5, '120/80', 62]
      );
    }
  }

  const appointmentCount = await client.query('SELECT COUNT(*)::INT AS count FROM appointment;');
  if (appointmentCount.rows[0].count === 0 && userRows.rows.length > 0 && centerRows.rows.length > 0) {
    await client.query(
      `
        INSERT INTO appointment (user_id, center_id, date_time, status)
        VALUES
          ($1, $2, $3, $4),
          ($5, $6, $7, $8)
      `,
      [
        userRows.rows[0].user_id,
        centerRows.rows[0].center_id,
        '2026-04-10 09:30:00',
        'Scheduled',
        userRows.rows[1]?.user_id ?? userRows.rows[0].user_id,
        centerRows.rows[0].center_id,
        '2026-04-12 14:00:00',
        'Scheduled'
      ]
    );
  }

  const donationRecordCount = await client.query('SELECT COUNT(*)::INT AS count FROM donation_record;');
  if (donationRecordCount.rows[0].count === 0 && userRows.rows.length > 0 && centerRows.rows.length > 0) {
    await client.query(
      `
        INSERT INTO donation_record (user_id, staff_id, center_id, date, volume, status)
        VALUES
          ($1, $2, $3, $4, $5, $6),
          ($7, $8, $9, $10, $11, $12)
      `,
      [
        userRows.rows[0].user_id,
        staffRows.rows[0]?.staff_id ?? null,
        centerRows.rows[0].center_id,
        '2026-03-28',
        450,
        'Accepted',
        userRows.rows[1]?.user_id ?? userRows.rows[0].user_id,
        staffRows.rows[0]?.staff_id ?? null,
        centerRows.rows[0].center_id,
        '2026-03-30',
        350,
        'Pending'
      ]
    );
  }

  const bloodCount = await client.query('SELECT COUNT(*)::INT AS count FROM blood;');
  if (bloodCount.rows[0].count === 0) {
    const acceptedDonation = await client.query(`
      SELECT dr.donation_id, COALESCE(u.blood_type_id, (SELECT type_id FROM blood_type WHERE type = 'O+' LIMIT 1)) AS blood_type_id
      FROM donation_record dr
      JOIN users u ON u.user_id = dr.user_id
      WHERE dr.status = 'Accepted'
      ORDER BY dr.donation_id
      LIMIT 1;
    `);

    const accepted = acceptedDonation.rows[0];
    if (accepted) {
      await client.query(
        `
          INSERT INTO blood (donation_id, blood_type_id, volume, collected_date, expiry_date)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [accepted.donation_id, accepted.blood_type_id, 450, '2026-03-28', '2026-05-02']
      );
    }
  }

  const inventoryCount = await client.query('SELECT COUNT(*)::INT AS count FROM blood_inventory;');
  if (inventoryCount.rows[0].count === 0 && centerRows.rows.length > 0) {
    const bloodRow = await client.query('SELECT blood_id FROM blood ORDER BY blood_id LIMIT 1;');
    if (bloodRow.rows[0]) {
      await client.query(
        `
          INSERT INTO blood_inventory (quantity_units, last_update, blood_id, center_id, status)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [1, '2026-04-02', bloodRow.rows[0].blood_id, centerRows.rows[0].center_id, 'Available']
      );
    }
  }

  const bloodRequestCount = await client.query('SELECT COUNT(*)::INT AS count FROM blood_request;');
  if (bloodRequestCount.rows[0].count === 0 && userRows.rows.length > 0 && staffRows.rows.length > 0) {
    await client.query(
      `
        INSERT INTO blood_request (quantity_units, request_date, status, user_id, staff_id, blood_type_id)
        VALUES
          ($1, $2, $3, $4, $5, $6),
          ($7, $8, $9, $10, $11, $12)
      `,
      [
        2,
        '2026-04-04',
        'Pending',
        userRows.rows[0].user_id,
        staffRows.rows[0].staff_id,
        userRows.rows[0].blood_type_id ?? bloodTypeMap['O+'],
        1,
        '2026-04-05',
        'Accepted',
        userRows.rows[1]?.user_id ?? userRows.rows[0].user_id,
        staffRows.rows[0].staff_id,
        userRows.rows[1]?.blood_type_id ?? bloodTypeMap['A+']
      ]
    );
  }
};

export const initializeDatabase = async () => {
  if (!isValidIdentifier(DB_NAME)) {
    throw new Error(`Invalid DB_NAME value: ${DB_NAME}`);
  }

  if (!isValidIdentifier(DB_ADMIN_NAME)) {
    throw new Error(`Invalid DB_ADMIN_NAME value: ${DB_ADMIN_NAME}`);
  }

  if (DB_CREATE_IF_MISSING) {
    const adminClient = createClient(DB_ADMIN_NAME);

    try {
      await adminClient.connect();

      const dbExists = await adminClient.query(
        'SELECT 1 FROM pg_database WHERE datname = $1;',
        [DB_NAME]
      );

      if (dbExists.rowCount === 0) {
        await adminClient.query(`CREATE DATABASE ${DB_NAME};`);
        console.log(`Database ${DB_NAME} created.`);
      } else {
        console.log(`Database ${DB_NAME} already exists.`);
      }
    } finally {
      await adminClient.end().catch(() => null);
    }
  } else {
    console.log('DB_CREATE_IF_MISSING=false, skipping CREATE DATABASE step.');
  }

  const appClient = createClient(DB_NAME);

  try {
    await appClient.connect();
    await appClient.query('SELECT pg_advisory_lock(hashtext($1));', [DB_INIT_LOCK_KEY]);

    try {
      await createSchema(appClient);
      await seedData(appClient);
    } finally {
      await appClient.query('SELECT pg_advisory_unlock(hashtext($1));', [DB_INIT_LOCK_KEY]).catch(() => null);
    }

    console.log('Database schema verified and seed data populated.');
  } finally {
    await appClient.end().catch(() => null);
  }
};

const isExecutedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isExecutedDirectly) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error.message);
      process.exit(1);
    });
}
