const express = require('express');
const router = express.Router();

const donorController = require('../controller/donorController');
const donorDetailController = require("../controller/donordetailController");
const deletedDonorController = require('../controller/deletedonorController');
const { updateDonor } = require('../controller/updateDonorController');
const { createDonor } = require('../controller/createdonorController'); // ✅ Correct import

// Routes
router.get('/', donorController.getDonors);
router.get('/:id/details', donorDetailController.getDonorDetails);
router.delete('/:id', deletedDonorController.deleteDonor);
router.put('/:id', updateDonor);
router.post('/', createDonor); // ✅ Now this works

module.exports = router;
