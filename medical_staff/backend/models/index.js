import sequelize from '../config/database.js';
import BloodType from './BloodType.js';
import DonationCenter from './DonationCenter.js';
import User from './User.js';
import Appointment from './Appointment.js';
import BloodRequest from './BloodRequest.js';
import MedicalStaff from './MedicalStaff.js';

// Define associations
BloodRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(BloodRequest, {
  foreignKey: 'user_id',
  as: 'bloodRequests'
});

BloodRequest.belongsTo(MedicalStaff, {
  foreignKey: 'staff_id',
  as: 'staff'
});

MedicalStaff.hasMany(BloodRequest, {
  foreignKey: 'staff_id',
  as: 'bloodRequests'
});

MedicalStaff.belongsTo(DonationCenter, {
  foreignKey: 'center_id',
  as: 'center'
});

DonationCenter.hasMany(MedicalStaff, {
  foreignKey: 'center_id',
  as: 'medicalStaff'
});

export {
  sequelize,
  BloodType,
  DonationCenter,
  User,
  Appointment,
  BloodRequest,
  MedicalStaff
}; 