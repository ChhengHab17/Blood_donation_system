import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const Blood = sequelize.define('Blood', {
  blood_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'blood_id'
  },
  donation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'donation_id',
    references: {
      model: 'donation_record',
      key: 'donation_id'
    }
  },
  blood_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'blood_type_id',
    references: {
      model: 'blood_type',
      key: 'type_id'
    }
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'volume'
  },
  collected_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'collected_date'
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'expiry_date'
  }
}, {
  tableName: 'blood',
  timestamps: false,
  underscored: true
});

export default Blood; 