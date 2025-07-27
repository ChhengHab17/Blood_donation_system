import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllBloodRequestsCon,
  getBloodRequestByIdCon,
  createBloodRequestCon,
  updateBloodRequestCon,
  updateBloodRequestStatusCon,
  deleteBloodRequestCon,
  getBloodRequestStatsCon
} from '../controller/bloodRequestController.js';

const router = express.Router();

// @route   GET /api/blood-requests
// @desc    Get all blood requests with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Pending', 'Accepted', 'Rejected']).withMessage('Invalid status'),
  query('requestType').optional().isIn(['user', 'center']).withMessage('Invalid request type'),
  query('search').optional().isString().withMessage('Search must be a string')
], getAllBloodRequestsCon);

// @route   GET /api/blood-requests/:id
// @desc    Get blood request by ID
router.get('/:id', getBloodRequestByIdCon);

// @route   POST /api/blood-requests
// @desc    Create a new blood request
router.post('/', [
  body('user_id').optional().isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  body('center_id').optional().isInt({ min: 1 }).withMessage('Center ID must be a positive integer'),
  body('blood_type_id').isInt({ min: 1 }).withMessage('Blood type ID must be a positive integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('date_request').isISO8601().withMessage('Date request must be a valid ISO date'),
  body('status').optional().isIn(['Pending', 'Accepted', 'Rejected']).withMessage('Invalid status'),
  body('request_type').isIn(['user', 'center']).withMessage('Request type must be user or center')
], createBloodRequestCon);

// @route   PUT /api/blood-requests/:id
// @desc    Update blood request
router.put('/:id', [
  body('blood_type_id').optional().isInt({ min: 1 }).withMessage('Blood type ID must be a positive integer'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('date_request').optional().isISO8601().withMessage('Date request must be a valid ISO date'),
  body('status').optional().isIn(['Pending', 'Accepted', 'Rejected']).withMessage('Invalid status')
], updateBloodRequestCon);

// @route   PATCH /api/blood-requests/:id/status
// @desc    Update blood request status
router.patch('/:id/status', [
  body('status').isIn(['Pending', 'Accepted', 'Rejected']).withMessage('Invalid status')
], updateBloodRequestStatusCon);

// @route   DELETE /api/blood-requests/:id
// @desc    Delete blood request
router.delete('/:id', deleteBloodRequestCon);

// @route   GET /api/blood-requests/stats/overview
// @desc    Get blood request statistics
router.get('/stats/overview', getBloodRequestStatsCon);

export default router;
