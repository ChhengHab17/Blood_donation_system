import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    console.log('Current config:');
    console.log('  Host:', process.env.DB_HOST || 'turntable.proxy.rlwy.net');
    console.log('  Port:', process.env.DB_PORT || '30669');
    console.log('  User:', process.env.DB_USER || 'postgres');
    console.log('  Database:', process.env.DB_NAME || 'Blood_donation_center');
    
    // First, try to connect to the default postgres database to list available databases
    const tempSequelize = new Sequelize(
      'postgres', // Connect to default postgres database
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'oOeWhLTpBXjoifSnDegMHxQCbYSIABPe',
      {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
        port: process.env.DB_PORT || '30669',
        logging: false
      }
    );

    await tempSequelize.authenticate();
    console.log('✅ Connected to PostgreSQL server successfully');
    
    // List all databases
    const [databases] = await tempSequelize.query(`
      SELECT datname 
      FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname
    `);
    
    console.log('\n📋 Available databases:');
    databases.forEach(db => {
      console.log(`  - ${db.datname}`);
    });
    
    // Try to connect to the intended database
    const intendedDb = process.env.DB_NAME || 'Blood_donation_center';
    console.log(`\n🔍 Trying to connect to: ${intendedDb}`);
    
    const mainSequelize = new Sequelize(
      intendedDb,
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'oOeWhLTpBXjoifSnDegMHxQCbYSIABPe',
      {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
        port: process.env.DB_PORT || '30669',
        logging: false
      }
    );

    await mainSequelize.authenticate();
    console.log(`✅ Successfully connected to database: ${intendedDb}`);
    
    // Check if appointment table exists
    const [tables] = await mainSequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    await tempSequelize.close();
    await mainSequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Suggestion: Check your .env file and make sure DB_NAME matches one of the available databases above.');
    }
  }
}

checkDatabase(); 