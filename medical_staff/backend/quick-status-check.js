import sequelize from './config/database.js';

async function quickCheck() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Get all unique status values
    const [results] = await sequelize.query(`
      SELECT DISTINCT status, COUNT(*) as count 
      FROM appointment 
      GROUP BY status 
      ORDER BY status
    `);
    
    console.log('\n📋 Current status values in database:');
    results.forEach(row => {
      console.log(`  "${row.status}" - ${row.count} appointments`);
    });
    
    // Get one sample appointment
    const [sample] = await sequelize.query(`
      SELECT appointment_id, status, date_time 
      FROM appointment 
      LIMIT 1
    `);
    
    if (sample.length > 0) {
      console.log(`\n📋 Sample appointment: ID ${sample[0].appointment_id}, Status: "${sample[0].status}"`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

quickCheck(); 