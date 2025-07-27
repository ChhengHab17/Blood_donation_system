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
  center_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'center_id'
  },
  blood_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'blood_type_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity'
  },
  date_request: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_request'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
    field: 'status'
  },
  request_type: {
    type: DataTypes.ENUM('user', 'center'),
    allowNull: false,
    field: 'request_type'
  }
}, {
  tableName: 'blood_request',
  timestamps: false,
  underscored: true
});

export default BloodRequest;
