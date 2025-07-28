import { BloodInventory, Blood, BloodType } from '../models/index.js';

export async function getInventoryService(limit = 10, offset = 0, center_id) {
  return await BloodInventory.findAll({
    include: [
      {
        model: Blood,
        attributes: ['blood_id', 'collected_date', 'expiry_date'],
        include: [
          { model: BloodType, attributes: ['type'] }
        ]
      }
    ],
    attributes: ['quantity_units'],
    where: { center_id },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['quantity_units', 'DESC']] // Sort by quantity descending
  });
} 