import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BloodRequest = sequelize.define('BloodRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'request_id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id'
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'staff_id'
  },
  quantity_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity_units'
  },
  request_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'request_date'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
    field: 'status'
  }
}, {
  tableName: 'blood_request',
  timestamps: false,
  underscored: true
});

export default BloodRequest;
