import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllAppointmentsCon,
  getAppointmentByIdCon,
  createAppointmentCon,
  updateAppointmentCon,
  updateAppointmentStatusCon,
  deleteAppointmentCon,
  getAppointmentStatsCon
} from '../controller/appointmentController.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Scheduled', 'Completed', 'Cancelled', 'No show']),
  query('search').optional().isString().withMessage('Search must be a string')
], getAllAppointmentsCon);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
router.get('/:id', getAppointmentByIdCon);

// @route   POST /api/appointments
// @desc    Create a new appointment
router.post('/', [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  body('center_id')
    .isInt({ min: 1 })
    .withMessage('Center ID must be a positive integer'),
  body('date_time')
    .isISO8601()
    .withMessage('Date and time must be a valid ISO date'),
  body('status')
    .optional()
    .isIn(['Scheduled', 'Completed', 'Cancelled', 'No show'])
    .withMessage('Invalid status')
], createAppointmentCon);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
router.put('/:id', [
  body('date_time')
    .optional()
    .isISO8601()
    .withMessage('Date and time must be a valid ISO date'),
  body('status')
    .optional()
    .isIn(['Scheduled', 'Completed', 'Cancelled', 'No show'])
    .withMessage('Invalid status')
], updateAppointmentCon);

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status
router.patch('/:id/status', [
  body('status')
    .isIn(['Scheduled', 'Completed', 'Cancelled', 'No show'])
    .withMessage('Invalid status')
], updateAppointmentStatusCon);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
router.delete('/:id', deleteAppointmentCon);

// @route   GET /api/appointments/stats/overview
// @desc    Get appointment statistics
router.get('/stats/overview', getAppointmentStatsCon);

export default router; 