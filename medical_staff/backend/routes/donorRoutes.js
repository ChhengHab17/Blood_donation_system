const express = require('express');
const router = express.Router();
const donorController = require('../controller/donorController');
const donorDetailController = require("../controller/donordetailController");


// Get all donors (e.g., for a table or list view)
router.get('/', donorController.getDonors);
router.get('/:id/details', donorDetailController.getDonorDetails);


module.exports = router;
