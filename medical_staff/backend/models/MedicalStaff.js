import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MedicalStaff = sequelize.define('MedicalStaff', {
  staff_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'staff_id'
  },
  center_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'center_id'
  },
  first_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'first_name'
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'email'
  },
  phone_num: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_num'
  },
  position: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'position'
  }
}, {
  tableName: 'medical_staff',
  timestamps: false,
  underscored: true
});

export default MedicalStaff; 