import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db_config.js';

const BloodInventory = sequelize.define('BloodInventory', {
  inventory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'inventory_id'
  },
  quantity_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity_units'
  },
  last_update: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'last_update'
  },
  blood_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'blood_id',
    references: {
      model: 'blood',
      key: 'blood_id'
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
  status: {
    type: DataTypes.ENUM('Available', 'Used', 'Expired', 'In Transit'),
    allowNull: false,
    field: 'status'
  }
}, {
  tableName: 'blood_inventory',
  timestamps: false,
  underscored: true
});

export default BloodInventory; 