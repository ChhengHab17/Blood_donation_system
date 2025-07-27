import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';
import Appointment from '../models/Appointment.js';

export const getAllAppointments = async (page = 1, limit = 10, status, search) => {
  try {
    console.log('getAllAppointments called with:', { page, limit, status, search });
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
      console.log('Adding status filter:', status);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      order: [['date_time', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Transform appointments to include user and center data for frontend compatibility
    const transformedAppointments = appointments.map(appointment => {
      // Use the exact status from database (no mapping needed)
      return {
        appointment_id: appointment.appointment_id,
        user_id: appointment.user_id,
        center_id: appointment.center_id,
        date_time: appointment.date_time,
        status: appointment.status || 'No show',
      // Mock user data for frontend compatibility
      first_name: `User ${appointment.user_id}`,
      last_name: 'Doe',
      email: `user${appointment.user_id}@example.com`,
      phone_num: `+1-555-${String(appointment.user_id).padStart(4, '0')}`,
      gender: appointment.user_id % 2 === 0 ? 'Female' : 'Male',
      DoB: new Date(1990, 0, 1 + appointment.user_id).toISOString().split('T')[0],
      address: `${appointment.user_id} Main Street`,
        blood_type: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][appointment.user_id % 8],
        // Mock center data
        center_name: 'Central Blood Bank',
        center_address: '123 Main Street',
        center_city: 'New York'
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