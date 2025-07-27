import sequelize from './config/database.js';

async function checkEnum() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Check the enum type values
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
    
    console.log('\n📋 Enum values for appointment_status:');
    enumResults.forEach((row, index) => {
      console.log(`  ${index + 1}. "${row.enumlabel}"`);
    });
    
    // Also check what's currently in the appointment table
    const [appointmentResults] = await sequelize.query(`
      SELECT DISTINCT status, COUNT(*) as count 
      FROM appointment 
      GROUP BY status 
      ORDER BY status
    `);
    
    console.log('\n📋 Current status values in appointment table:');
    appointmentResults.forEach(row => {
      console.log(`  "${row.status}" - ${row.count} appointments`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkEnum(); 