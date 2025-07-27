import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const BloodRequest = sequelize.define('BloodRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'request_id'
  },
  quantity_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity_units'
  },
  request_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'request_date'
  },
  status: {
    type: DataTypes.ENUM('Accepted', 'Rejected', 'Pending'),
    allowNull: false,
    field: 'status'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'staff_id',
    references: {
      model: 'medical_staff',
      key: 'staff_id'
    }
  },
  blood_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'blood_type_id',
    references: {
      model: 'blood_type',
      key: 'type_id'
    }
  }
}, {
  tableName: 'blood_request',
  timestamps: false,
  underscored: true
});

export default BloodRequest; 