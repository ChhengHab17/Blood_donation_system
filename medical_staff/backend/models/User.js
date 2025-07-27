import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id'
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
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
    field: 'gender'
  },
  DoB: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'DoB'
  },
  blood_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'blood_type_id'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'address'
  },
  phone_num: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_num'
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'email'
  },
  last_donation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'last_donation_date'
  },
  create_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'create_at'
  }
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true
});

export default User; 