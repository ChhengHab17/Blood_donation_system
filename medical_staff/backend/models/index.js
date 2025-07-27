import { sequelize } from '../config/db_config.js';
import BloodType from './BloodType.js';
import DonationCenter from './DonationCenter.js';
import User from './User.js';
import MedicalStaff from './MedicalStaff.js';
import EligibilityRecord from './EligibilityRecord.js';
import Appointment from './Appointment.js';
import DonationRecord from './DonationRecord.js';
import Blood from './Blood.js';
import BloodInventory from './BloodInventory.js';
import BloodRequest from './BloodRequest.js';

// Define associations
BloodType.hasMany(User, { foreignKey: 'blood_type_id' });
BloodType.hasMany(Blood, { foreignKey: 'blood_type_id' });

DonationCenter.hasMany(MedicalStaff, { foreignKey: 'center_id' });
DonationCenter.hasMany(Appointment, { foreignKey: 'center_id' });
DonationCenter.hasMany(DonationRecord, { foreignKey: 'center_id' });
DonationCenter.hasMany(BloodInventory, { foreignKey: 'center_id' });

User.belongsTo(BloodType, { foreignKey: 'blood_type_id' });
User.hasMany(EligibilityRecord, { foreignKey: 'user_id' });
User.hasMany(Appointment, { foreignKey: 'user_id' });
User.hasMany(DonationRecord, { foreignKey: 'user_id' });
User.hasMany(BloodRequest, { foreignKey: 'user_id' });

MedicalStaff.belongsTo(DonationCenter, { foreignKey: 'center_id' });
MedicalStaff.hasMany(DonationRecord, { foreignKey: 'staff_id' });
MedicalStaff.hasMany(BloodRequest, { foreignKey: 'staff_id' });

EligibilityRecord.belongsTo(User, { foreignKey: 'user_id' });

Appointment.belongsTo(User, { foreignKey: 'user_id' });
Appointment.belongsTo(DonationCenter, { foreignKey: 'center_id' });

DonationRecord.belongsTo(User, { foreignKey: 'user_id' });
DonationRecord.belongsTo(MedicalStaff, { foreignKey: 'staff_id' });
DonationRecord.belongsTo(DonationCenter, { foreignKey: 'center_id' });
DonationRecord.hasOne(Blood, { foreignKey: 'donation_id' });

Blood.belongsTo(DonationRecord, { foreignKey: 'donation_id' });
Blood.belongsTo(BloodType, { foreignKey: 'blood_type_id' });
Blood.hasOne(BloodInventory, { foreignKey: 'blood_id' });

BloodInventory.belongsTo(Blood, { foreignKey: 'blood_id' });
BloodInventory.belongsTo(DonationCenter, { foreignKey: 'center_id' });

BloodRequest.belongsTo(User, { foreignKey: 'user_id' });
BloodRequest.belongsTo(MedicalStaff, { foreignKey: 'staff_id' });
BloodRequest.belongsTo(BloodType, { foreignKey: 'blood_type_id' });

export {
  sequelize,
  BloodType,
  DonationCenter,
  User,
  MedicalStaff,
  EligibilityRecord,
  Appointment,
  DonationRecord,
  Blood,
  BloodInventory,
  BloodRequest
}; 