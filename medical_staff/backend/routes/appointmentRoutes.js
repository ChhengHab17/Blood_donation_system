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

const appointmentRouter = express.Router();

// --------------------
// Specific routes FIRST
// --------------------

// @route   GET /api/appointments/stats/overview
// @desc    Get appointment statistics
appointmentRouter.get('/stats/overview', getAppointmentStatsCon);

// --------------------
// General and dynamic routes
// --------------------

// @route   GET /api/appointments
// @desc    Get all appointments with filtering and pagination
appointmentRouter.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['Scheduled', 'Completed', 'Cancelled', 'No show']),
  query('search').optional().isString().withMessage('Search must be a string')
], getAllAppointmentsCon);

// @route   POST /api/appointments
// @desc    Create a new appointment
appointmentRouter.post('/', [
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

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
appointmentRouter.get('/:id', getAppointmentByIdCon);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
appointmentRouter.put('/:id', [
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
appointmentRouter.patch('/:id/status', [
  body('status')
    .isIn(['Scheduled', 'Completed', 'Cancelled', 'No show'])
    .withMessage('Invalid status')
], updateAppointmentStatusCon);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
appointmentRouter.delete('/:id', deleteAppointmentCon);

export default appointmentRouter;