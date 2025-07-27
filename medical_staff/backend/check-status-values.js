import sequelize from './config/database.js';

async function checkStatusValues() {
  try {
    console.log('🔍 Checking appointment status values in database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Query to get all unique status values
    const [results] = await sequelize.query(`
      SELECT DISTINCT status 
      FROM appointment 
      ORDER BY status
    `);
    
    console.log('📋 Available status values in database:');
    results.forEach(row => {
      console.log(`  - "${row.status}"`);
    });
    
    // Also check the enum type definition
    const [enumResults] = await sequelize.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid 
        FROM pg_type 
        WHERE typname = 'appointment_status'
      )
      ORDER BY enumsortorder
    `);
    
    console.log('📋 Enum type values:');
    enumResults.forEach(row => {
      console.log(`  - "${row.enumlabel}"`);
    });
    
    // Get sample appointments with their statuses
    const [appointments] = await sequelize.query(`
      SELECT appointment_id, status, date_time 
      FROM appointment 
      LIMIT 5
    `);
    
    console.log('📋 Sample appointments:');
    appointments.forEach(app => {
      console.log(`  - ID: ${app.appointment_id}, Status: "${app.status}", Date: ${app.date_time}`);
    });
    
    console.log('🎉 Status check completed!');
    
  } catch (error) {
    console.error('❌ Error checking status values:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

checkStatusValues(); 