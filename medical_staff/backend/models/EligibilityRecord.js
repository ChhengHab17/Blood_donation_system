import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const EligibilityRecord = sequelize.define('EligibilityRecord', {
  eligibility_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'eligibility_id'
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
  is_eligible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_eligible'
  },
  check_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_date'
  },
  hemoglobin_level: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'hemoglobin_level'
  },
  blood_pressure: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'blood_pressure'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'weight'
  }
}, {
  tableName: 'eligibility_record',
  timestamps: false,
  underscored: true
});

export default EligibilityRecord; 