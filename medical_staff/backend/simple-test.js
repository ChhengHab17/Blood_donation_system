import sequelize from './config/database.js';
import Appointment from './models/Appointment.js';

async function simpleTest() {
  try {
    console.log('🔍 Testing simple database connection...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Check appointments
    const appointmentCount = await Appointment.count();
    console.log(`📅 Appointments in database: ${appointmentCount}`);
    
    if (appointmentCount > 0) {
      const sampleAppointment = await Appointment.findOne();
      console.log('📋 Sample appointment:', {
        id: sampleAppointment.appointment_id,
        status: sampleAppointment.status,
        date: sampleAppointment.date_time,
        user_id: sampleAppointment.user_id,
        center_id: sampleAppointment.center_id
      });
    } else {
      console.log('⚠️  No appointments found in database');
    }
    
    console.log('🎉 Simple test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

simpleTest(); 