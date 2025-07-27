import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DonationCenter = sequelize.define('DonationCenter', {
  center_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'center_id'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'name'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'address'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'city'
  },
  contact_num: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'contact_num'
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'email'
  }
}, {
  tableName: 'donation_center',
  timestamps: false,
  underscored: true
});

export default DonationCenter; 