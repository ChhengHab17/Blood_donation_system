import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const DonationRecord = sequelize.define('DonationRecord', {
  donation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'donation_id'
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
  center_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'center_id',
    references: {
      model: 'donation_center',
      key: 'center_id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date'
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'volume'
  },
  status: {
    type: DataTypes.ENUM('Accepted', 'Rejected', 'Pending'),
    allowNull: false,
    field: 'status'
  }
}, {
  tableName: 'donation_record',
  timestamps: false,
  underscored: true
});

export default DonationRecord; 