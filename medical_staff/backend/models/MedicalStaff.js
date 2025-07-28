import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const MedicalStaff = sequelize.define('MedicalStaff', {
  staff_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'staff_id'
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
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password'
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'email'
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'role'
  },
  phone_num: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_num'
  },
  center_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'center_id',
    references: {
      model: 'donation_center',
      key: 'center_id'
    }
  }
}, {
  tableName: 'medical_staff',
  timestamps: false,
  underscored: true
});

export default MedicalStaff;