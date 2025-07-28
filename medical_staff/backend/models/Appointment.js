import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'appointment_id'
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
  center_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'center_id',
    references: {
      model: 'donation_center',
      key: 'center_id'
    }
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_time'
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'No show'),
    allowNull: false,
    field: 'status'
  }
}, {
  tableName: 'appointment',
  timestamps: false,
  underscored: true
});

export default Appointment; 