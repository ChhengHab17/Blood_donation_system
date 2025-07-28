import express from 'express';
import { getDonors, getDonorDetails, createDonor, deleteDonor, updateDonor } from '../controller/donorControllers.js';

export const donorRouter = express.Router();

// Routes
donorRouter.get('/', getDonors);
donorRouter.get('/:id/details', getDonorDetails);
donorRouter.delete('/:id', deleteDonor);
donorRouter.put('/:id', updateDonor);
donorRouter.post('/', createDonor);
