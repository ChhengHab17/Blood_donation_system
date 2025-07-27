import sequelize from './config/database.js';
import './models/index.js';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection and data...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Test each model
    const { User, DonationCenter, BloodType, Appointment } = await import('./models/index.js');
    
    // Check users
    const userCount = await User.count();
    console.log(`👥 Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const sampleUser = await User.findOne({
        include: [{ model: BloodType, as: 'bloodType' }]
      });
      console.log('📋 Sample user:', {
        id: sampleUser.user_id,
        name: `${sampleUser.first_name} ${sampleUser.last_name}`,
        email: sampleUser.email,
        bloodType: sampleUser.bloodType?.type
      });
    }
    
    // Check donation centers
    const centerCount = await DonationCenter.count();
    console.log(`🏥 Donation centers in database: ${centerCount}`);
    
    if (centerCount > 0) {
      const sampleCenter = await DonationCenter.findOne();
      console.log('📋 Sample center:', {
        id: sampleCenter.center_id,
        name: sampleCenter.name,
        city: sampleCenter.city
      });
    }
    
    // Check blood types
    const bloodTypeCount = await BloodType.count();
    console.log(`🩸 Blood types in database: ${bloodTypeCount}`);
    
    if (bloodTypeCount > 0) {
      const bloodTypes = await BloodType.findAll();
      console.log('📋 Blood types:', bloodTypes.map(bt => bt.type).join(', '));
    }
    
    // Check appointments
    const appointmentCount = await Appointment.count();
    console.log(`📅 Appointments in database: ${appointmentCount}`);
    
    if (appointmentCount > 0) {
      const sampleAppointment = await Appointment.findOne({
        include: [
          { model: User, as: 'user' },
          { model: DonationCenter, as: 'center' }
        ]
      });
      console.log('📋 Sample appointment:', {
        id: sampleAppointment.appointment_id,
        status: sampleAppointment.status,
        date: sampleAppointment.date_time,
        user: sampleAppointment.user ? `${sampleAppointment.user.first_name} ${sampleAppointment.user.last_name}` : 'No user',
        center: sampleAppointment.center?.name || 'No center'
      });
    }
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

testDatabase(); 