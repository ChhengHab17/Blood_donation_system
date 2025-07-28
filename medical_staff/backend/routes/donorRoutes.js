import express from 'express';
import { getDonors, getDonorDetails, createDonor, deleteDonor, updateDonor } from '../controller/donorControllers.js';

const router = express.Router();

// Routes
router.get('/', getDonors);
router.get('/:id/details', getDonorDetails);
router.delete('/:id', deleteDonor);
router.put('/:id', updateDonor);
router.post('/', createDonor);

export default router;
