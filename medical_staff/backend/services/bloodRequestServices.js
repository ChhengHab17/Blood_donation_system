import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';
import BloodRequest from '../models/BloodRequest.js';
import User from '../models/User.js';
import DonationCenter from '../models/DonationCenter.js';
import BloodType from '../models/BloodType.js';
import MedicalStaff from '../models/MedicalStaff.js';

export const getAllBloodRequests = async (page = 1, limit = 10, status, requestType, search) => {
  try {
    console.log('getAllBloodRequests called with:', { page, limit, status, requestType, search });
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
      console.log('Adding status filter:', status);
    }
    if (requestType) {
      whereClause.request_type = requestType;
      console.log('Adding request type filter:', requestType);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: bloodRequests } = await BloodRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: BloodType,
              as: 'bloodType'
            }
          ]
        },
        {
          model: DonationCenter,
          as: 'center'
        },
        {
          model: BloodType,
          as: 'bloodType'
        }
      ],
      order: [['date_request', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Transform blood requests with proper data
    const transformedRequests = bloodRequests.map(request => {
      if (request.request_type === 'user') {
        // User request data
        return {
          request_id: request.request_id,
          user_id: request.user_id,
          center_id: request.center_id,
          blood_type_id: request.blood_type_id,
          quantity: request.quantity,
          date_request: request.date_request,
          status: request.status,
          request_type: request.request_type,
          // User data
          name: request.user ? `${request.user.first_name} ${request.user.last_name}` : 'Unknown User',
          dob: request.user?.DoB ? new Date(request.user.DoB).toLocaleDateString('en-GB') : 'N/A',
          contact_num: request.user?.phone_num || 'N/A',
          blood_type: request.bloodType?.type || 'N/A',
          // Center data (for user requests, this might be the requesting center)
          center_name: request.center?.name || 'N/A',
          center_contact: request.center?.contact_num || 'N/A'
        };
      } else {
        // Center request data
        return {
          request_id: request.request_id,
          user_id: request.user_id,
          center_id: request.center_id,
          blood_type_id: request.blood_type_id,
          quantity: request.quantity,
          date_request: request.date_request,
          status: request.status,
          request_type: request.request_type,
          // Center data
          center_name: request.center?.name || 'Unknown Center',
          center_contact: request.center?.contact_num || 'N/A',
          center_address: request.center?.address || 'N/A',
          center_city: request.center?.city || 'N/A',
          // Blood type data
          blood_type: request.bloodType?.type || 'N/A'
        };
      }
    });

    return {
      bloodRequests: transformedRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllBloodRequests:', error);
    throw new Error(`Failed to get blood requests: ${error.message}`);
  }
};

export const getBloodRequestById = async (id) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: BloodType,
              as: 'bloodType'
            }
          ]
        },
        {
          model: DonationCenter,
          as: 'center'
        },
        {
          model: BloodType,
          as: 'bloodType'
        }
      ]
    });
    
    if (!bloodRequest) {
      throw new Error('Blood request not found');
    }
    return bloodRequest;
  } catch (error) {
    throw new Error(`Failed to get blood request: ${error.message}`);
  }
};

export const createBloodRequest = async (bloodRequestData) => {
  try {
    const bloodRequest = await BloodRequest.create(bloodRequestData);
    return bloodRequest;
  } catch (error) {
    throw new Error(`Failed to create blood request: ${error.message}`);
  }
};

export const updateBloodRequest = async (id, updateData) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(id);
    if (!bloodRequest) {
      throw new Error('Blood request not found');
    }

    await bloodRequest.update(updateData);
    return bloodRequest;
  } catch (error) {
    throw new Error(`Failed to update blood request: ${error.message}`);
  }
};

export const updateBloodRequestStatus = async (id, status) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(id);
    if (!bloodRequest) {
      throw new Error('Blood request not found');
    }

    // Log the status being updated for debugging
    console.log(`Updating blood request ${id} status from "${bloodRequest.status}" to "${status}"`);

    // Use raw SQL to bypass any validation issues
    await sequelize.query(
      'UPDATE blood_request SET status = $1 WHERE request_id = $2',
      {
        bind: [status, id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Fetch the updated blood request
    const updatedBloodRequest = await BloodRequest.findByPk(id);
    return updatedBloodRequest;
  } catch (error) {
    console.error('Raw SQL update error:', error);
    throw new Error(`Failed to update blood request status: ${error.message}`);
  }
};

export const deleteBloodRequest = async (id) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(id);
    if (!bloodRequest) {
      throw new Error('Blood request not found');
    }

    await bloodRequest.destroy();
    return { message: 'Blood request deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete blood request: ${error.message}`);
  }
};

export const getBloodRequestStats = async () => {
  try {
    const stats = await BloodRequest.findAll({
      attributes: [
        [fn('COUNT', col('request_id')), 'total_requests'],
        [fn('COUNT', literal("CASE WHEN status = 'Pending' THEN 1 END")), 'pending_requests'],
        [fn('COUNT', literal("CASE WHEN status = 'Accepted' THEN 1 END")), 'accepted_requests'],
        [fn('COUNT', literal("CASE WHEN status = 'Rejected' THEN 1 END")), 'rejected_requests'],
        [fn('COUNT', literal("CASE WHEN request_type = 'user' THEN 1 END")), 'user_requests'],
        [fn('COUNT', literal("CASE WHEN request_type = 'center' THEN 1 END")), 'center_requests']
      ],
      raw: true
    });

    const result = stats[0];

    return {
      total: parseInt(result.total_requests),
      statusBreakdown: {
        pending: parseInt(result.pending_requests),
        accepted: parseInt(result.accepted_requests),
        rejected: parseInt(result.rejected_requests)
      },
      typeBreakdown: {
        user: parseInt(result.user_requests),
        center: parseInt(result.center_requests)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get blood request stats: ${error.message}`);
  }
}; 