import { body, validationResult, query } from 'express-validator';
import {
  getAllBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  updateBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
  getBloodRequestStats
} from '../services/bloodRequestServices.js';

export const getAllBloodRequestsCon = async (req, res) => {
  try {
    console.log('getAllBloodRequestsCon received query:', req.query);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, status, requestType, search } = req.query;
    console.log('Extracted query params:', { page, limit, status, requestType, search });
    
    const result = await getAllBloodRequests(page, limit, status, requestType, search);

    res.json(result);
  } catch (error) {
    console.error('Get blood requests error:', error);
    res.status(500).json({
      error: 'Failed to get blood requests',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getBloodRequestByIdCon = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodRequest = await getBloodRequestById(id);

    res.json(bloodRequest);
  } catch (error) {
    console.error('Get blood request error:', error);
    res.status(404).json({
      error: 'Blood request not found',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createBloodRequestCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bloodRequestData = req.body;
    const bloodRequest = await createBloodRequest(bloodRequestData);

    res.status(201).json({
      message: 'Blood request created successfully',
      bloodRequest
    });
  } catch (error) {
    console.error('Create blood request error:', error);
    res.status(500).json({
      error: 'Failed to create blood request',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateBloodRequestCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;
    const bloodRequest = await updateBloodRequest(id, updateData);

    res.json({
      message: 'Blood request updated successfully',
      bloodRequest
    });
  } catch (error) {
    console.error('Update blood request error:', error);
    res.status(500).json({
      error: 'Failed to update blood request',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateBloodRequestStatusCon = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const bloodRequest = await updateBloodRequestStatus(id, status);

    res.json({
      message: 'Blood request status updated successfully',
      bloodRequest
    });
  } catch (error) {
    console.error('Update blood request status error:', error);
    res.status(500).json({
      error: 'Failed to update blood request status',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteBloodRequestCon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBloodRequest(id);

    res.json(result);
  } catch (error) {
    console.error('Delete blood request error:', error);
    res.status(500).json({
      error: 'Failed to delete blood request',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getBloodRequestStatsCon = async (req, res) => {
  try {
    const stats = await getBloodRequestStats();
    res.json(stats);
  } catch (error) {
    console.error('Get blood request stats error:', error);
    res.status(500).json({
      error: 'Failed to get blood request statistics',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 