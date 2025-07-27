import { body, validationResult, query } from 'express-validator';
import { 
  getAllAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  updateAppointmentStatus, 
  deleteAppointment, 
  getAppointmentStats 
} from '../services/appointmentServices.js';

export const getAllAppointmentsCon = async (req, res) => {
  try {
    console.log('getAllAppointmentsCon received query:', req.query);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, status, search } = req.query;
    console.log('Extracted query params:', { page, limit, status, search });
    
    const result = await getAllAppointments(page, limit, status, search);

    res.json(result);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      error: 'Failed to get appointments',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getAppointmentByIdCon = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(404).json({
      error: 'Appointment not found',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createAppointmentCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentData = req.body;
    const appointment = await createAppointment(appointmentData);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      error: 'Failed to create appointment',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateAppointmentCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;
    const appointment = await updateAppointment(id, updateData);

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      error: 'Failed to update appointment',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateAppointmentStatusCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const appointment = await updateAppointmentStatus(id, status);

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      error: 'Failed to update appointment status',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteAppointmentCon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAppointment(id);

    res.json(result);
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      error: 'Failed to delete appointment',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getAppointmentStatsCon = async (req, res) => {
  try {
    const stats = await getAppointmentStats();
    res.json(stats);
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      error: 'Failed to get appointment statistics',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 