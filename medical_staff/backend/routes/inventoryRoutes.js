import express from 'express';
import * as inventoryController from '../controller/inventoryController.js';

export const inventoryRouter = express.Router();

inventoryRouter.get('/', inventoryController.getInventory);

