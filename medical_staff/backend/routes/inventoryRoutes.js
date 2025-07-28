import express from 'express';
import * as inventoryController from '../controller/inventoryController.js';

const router = express.Router();

router.get('/', inventoryController.getInventory);

export default router;
