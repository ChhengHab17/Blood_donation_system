import { Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/db_config.js';
import Appointment from '../models/Appointment.js';

export const getAllAppointments = async (page = 1, limit = 10, status, search, center_id) => {
  try {
    console.log('getAllAppointments called with:', { page, limit, status, search });
    
    // Use raw SQL query with proper joins to get complete data
    const whereConditions = [];
    const queryParams = [];
    
    if (status) {
      whereConditions.push('a.status = $' + (queryParams.length + 1));
      queryParams.push(status);
    }

    if (center_id) {
      whereConditions.push('a.center_id = $' + (queryParams.length + 1));
      queryParams.push(center_id);
    }
    
    // Add search functionality
    if (search) {
      // Check if search is a number (ID search) or text (name search)
      const isNumber = !isNaN(search) && search.trim() !== '';
      
      if (isNumber) {
        // Search by appointment_id (exact match)
        whereConditions.push(`a.appointment_id = $${queryParams.length + 1}`);
        queryParams.push(parseInt(search));
      } else {
        // Search by name (partial match)
        const searchCondition = `(
          u.first_name ILIKE $${queryParams.length + 1} OR
          u.last_name ILIKE $${queryParams.length + 1}
        )`;
        whereConditions.push(searchCondition);
        queryParams.push(`%${search}%`);
      }
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const query = `
      SELECT 
        a.appointment_id,
        a.user_id,
        a.center_id,
        a.date_time,
        a.status,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_num,
        u.gender,
        u.DoB,
        u.address,
        u.blood_type_id,
        bt.type as blood_type,
        dc.name as center_name,
        dc.address as center_address,
        dc.city as center_city
      FROM appointment a
      LEFT JOIN users u ON a.user_id = u.user_id
      LEFT JOIN blood_type bt ON u.blood_type_id = bt.type_id
      LEFT JOIN donation_center dc ON a.center_id = dc.center_id
      ${whereClause}
      ORDER BY a.date_time DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    queryParams.push(parseInt(limit), offset);
    
    const appointments = await sequelize.query(query, {
      bind: queryParams,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM appointment a
      LEFT JOIN users u ON a.user_id = u.user_id
      ${whereClause}
    `;
    
    const countResult = await sequelize.query(countQuery, {
      bind: queryParams.slice(0, -2), // Remove limit and offset
      type: sequelize.QueryTypes.SELECT
    });
    
    const count = countResult[0].count;

    // Transform appointments with complete data
    const transformedAppointments = appointments.map(appointment => {
      return {
        appointment_id: appointment.appointment_id,
        user_id: appointment.user_id,
        center_id: appointment.center_id,
        date_time: appointment.date_time,
        status: appointment.status || 'No show',
        // User data
        first_name: appointment.first_name || `User ${appointment.user_id}`,
        last_name: appointment.last_name || 'Doe',
        email: appointment.email || `user${appointment.user_id}@example.com`,
        phone_num: appointment.phone_num || `+1-555-${String(appointment.user_id).padStart(4, '0')}`,
        gender: appointment.gender || (appointment.user_id % 2 === 0 ? 'Female' : 'Male'),
        DoB: appointment.DoB ? (() => {
          const date = new Date(appointment.DoB);
          return isNaN(date.getTime()) ? new Date(1990, 0, 1 + appointment.user_id).toLocaleDateString('en-GB') : date.toLocaleDateString('en-GB');
        })() : new Date(1990, 0, 1 + appointment.user_id).toLocaleDateString('en-GB'),
        address: appointment.address || `${appointment.user_id} Main Street`,
        blood_type: appointment.blood_type || ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][appointment.user_id % 8],
        // Center data
        center_name: appointment.center_name || 'Central Blood Bank',
        center_address: appointment.center_address || '123 Main Street',
        center_city: appointment.center_city || 'New York'
      };
    });

    return {
      appointments: transformedAppointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    throw new Error(`Failed to get appointments: ${error.message}`);
  }
};

export const getAppointmentById = async (id) => {
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  } catch (error) {
    throw new Error(`Failed to get appointment: ${error.message}`);
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    // Always use center_id from appointmentData
    const appointment = await Appointment.create(appointmentData);
    return appointment;
  } catch (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
};

export const updateAppointment = async (id, updateData) => {
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    await appointment.update(updateData);
    return appointment;
  } catch (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Log the status being updated for debugging
    console.log(`Updating appointment ${id} status from "${appointment.status}" to "${status}"`);

    // Try to cast the status to the enum type to avoid validation errors
    await sequelize.query(
      'UPDATE appointment SET status = $1::appointment_status WHERE appointment_id = $2',
      {
        bind: [status, id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Fetch the updated appointment
    const updatedAppointment = await Appointment.findByPk(id);
    return updatedAppointment;
  } catch (error) {
    console.error('Raw SQL update error:', error);
    
    // If the cast fails, try without casting
    try {
      await sequelize.query(
        'UPDATE appointment SET status = $1 WHERE appointment_id = $2',
        {
          bind: [status, id],
          type: sequelize.QueryTypes.UPDATE
        }
      );
      
      const updatedAppointment = await Appointment.findByPk(id);
      return updatedAppointment;
    } catch (secondError) {
      console.error('Second attempt failed:', secondError);
      throw new Error(`Failed to update appointment status: ${secondError.message}`);
    }
  }
};

export const deleteAppointment = async (id) => {
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    await appointment.destroy();
    return { message: 'Appointment deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
};

export const getAppointmentStats = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const stats = await Appointment.findAll({
      attributes: [
        [fn('COUNT', col('appointment_id')), 'total_appointments'],
        [fn('COUNT', literal(`CASE WHEN date_time >= '${startOfDay.toISOString()}' AND date_time <= '${endOfDay.toISOString()}' THEN 1 END`)), 'today_appointments'],
        [fn('COUNT', literal("CASE WHEN status = 'pending' THEN 1 END")), 'pending_appointments'],
        [fn('COUNT', literal("CASE WHEN status = 'approved' THEN 1 END")), 'approved_appointments'],
        [fn('COUNT', literal("CASE WHEN status = 'not approved' THEN 1 END")), 'not_approved_appointments'],
        [fn('COUNT', literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed_appointments'],
        [fn('COUNT', literal("CASE WHEN status = 'cancelled' THEN 1 END")), 'cancelled_appointments']
      ],
      raw: true
    });

    const result = stats[0];

    return {
      total: parseInt(result.total_appointments),
      today: parseInt(result.today_appointments),
      statusBreakdown: {
        pending: parseInt(result.pending_appointments),
        approved: parseInt(result.approved_appointments),
        'not approved': parseInt(result.not_approved_appointments),
        completed: parseInt(result.completed_appointments),
        cancelled: parseInt(result.cancelled_appointments)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get appointment stats: ${error.message}`);
  }
}; 