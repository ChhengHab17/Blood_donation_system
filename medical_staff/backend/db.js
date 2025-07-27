const { Pool } = require('pg');

const db = new Pool({
  host: 'centerbeam.proxy.rlwy.net',
  user: 'postgres',     // default PostgreSQL user
  password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan', // replace with your PostgreSQL password
  database: 'blood_donation_system', // must already exist
  port: 43047, // default PostgreSQL port
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

module.exports = db;
