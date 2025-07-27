import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BloodType = sequelize.define('BloodType', {
  type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'type_id'
  },
  type: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
    field: 'type'
  }
}, {
  tableName: 'blood_type',
  timestamps: false,
  underscored: true
});

export default BloodType; 