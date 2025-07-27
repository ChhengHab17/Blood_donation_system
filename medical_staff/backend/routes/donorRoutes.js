const express = require('express');
const router = express.Router();

const donorController = require('../controller/donorController');
const donorDetailController = require("../controller/donordetailController");
const deletedDonorController = require('../controller/deletedonorController');
const { updateDonor } = require('../controller/updateDonorController'); // ✅ Add this

// Routes
router.get('/', donorController.getDonors);
router.get('/:id/details', donorDetailController.getDonorDetails);
router.delete('/:id', deletedDonorController.deleteDonor);
router.put('/:id', updateDonor); // ✅ Now it's valid

module.exports = router;
