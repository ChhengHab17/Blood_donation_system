import sequelize from '../config/database.js';
import BloodType from './BloodType.js';
import DonationCenter from './DonationCenter.js';
import User from './User.js';
import Appointment from './Appointment.js';

// Simple exports without complex associations
export {
  sequelize,
  BloodType,
  DonationCenter,
  User,
  Appointment
}; 