import { User, BloodType, EligibilityRecord, Appointment, DonationCenter, DonationRecord, MedicalStaff, BloodRequest, Blood, BloodInventory } from '../models/index.js';

export async function createDonorService(data, staff_id, center_id) {
  const {
    first_name,
    last_name,
    password,
    gender,
    DoB,
    blood_type_id,
    address,
    phone_num,
    email,
    last_donation_date,
    volume, // can be undefined
    // Eligibility fields
    is_eligible,
    hemoglobin_level,
    blood_pressure,
    weight
  } = data;

  // Validate eligibility fields
  if (
    typeof is_eligible === 'undefined' ||
    typeof hemoglobin_level === 'undefined' ||
    typeof blood_pressure === 'undefined' ||
    typeof weight === 'undefined'
  ) {
    throw new Error('Missing eligibility fields');
  }

  // Prepare user data, only include password if provided
  const userData = {
    first_name,
    last_name,
    gender,
    dob: DoB,
    blood_type_id,
    address,
    phone_num,
    email,
    last_donation_date
  };

  if (password && password.trim()) {
    userData.password = password;
  }

  // Create the donor
  const user = await User.create(userData);

  // Use current date if last_donation_date is not provided
  const donationDate = last_donation_date || new Date();
  // If not eligible, force volume to 0; otherwise use provided or default
  const donationVolume = is_eligible ? (typeof volume !== 'undefined' ? volume : 450) : 0;

  // Create eligibility record for the new donor
  const eligibilityRecord = await EligibilityRecord.create({
    user_id: user.user_id,
    is_eligible,
    check_date: donationDate,
    hemoglobin_level,
    blood_pressure,
    weight
  });

  // Set donation status based on eligibility
  const donationStatus = is_eligible ? 'Accepted' : 'Rejected';

  // Create a donation record for the new donor
  const donationRecord = await DonationRecord.create({
    user_id: user.user_id,
    staff_id,
    center_id,
    date: donationDate,
    volume: donationVolume,
    status: donationStatus
  });

  // If donation is accepted, create blood inventory
  if (donationStatus === 'Accepted' && donationVolume > 0) {
    await createBloodInventoryFromDonation(donationRecord, user.blood_type_id, center_id);
  }

  return {
    message: 'Donor, donation, and eligibility record created successfully',
    user_id: user.user_id,
    eligibility_id: eligibilityRecord.eligibility_id
  };
}
export async function deleteDonorService(id) {
    const deleted = await User.destroy({ where: { user_id: id } });
    if (!deleted) throw new Error('Donor not found');
    return { message: 'Donor deleted successfully' };
}

export async function getDonorDetailsService(userId) {
    // Donor info
    const donor_info = await User.findOne({
      where: { user_id: userId },
      include: [
        { model: BloodType, attributes: ['type'] }
      ],
      raw: true,
      nest: true
    });
    if (!donor_info) return null;
  
    // Latest eligibility record
    const eligibility_record = await EligibilityRecord.findOne({
      where: { user_id: userId },
      order: [['check_date', 'DESC']],
      raw: true
    });
  
    // Last 5 appointments
    const appointments = await Appointment.findAll({
      where: { user_id: userId },
      include: [
        { model: DonationCenter, attributes: ['name'] }
      ],
      order: [['date_time', 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });
  
    // Donation history
    const donation_history = await DonationRecord.findAll({
      where: { user_id: userId },
      include: [
        { model: MedicalStaff, attributes: ['first_name', 'last_name'] },
        { model: DonationCenter, attributes: ['name'] }
      ],
      order: [['date', 'DESC']],
      raw: true,
      nest: true
    });
  
    // Last 5 blood requests
    const blood_requests = await BloodRequest.findAll({
      where: { user_id: userId },
      include: [
        { model: MedicalStaff, attributes: ['first_name', 'last_name'] }
      ],
      order: [['request_date', 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });
  
    // Debug: log counts to see if data exists
    console.log(`User ${userId} data counts:`, {
      eligibility_records: eligibility_record ? 1 : 0,
      appointments: appointments.length,
      donation_history: donation_history.length,
      blood_requests: blood_requests.length
    });
  
    return {
      donor_info,
      eligibility_record,
      appointments,
      donation_history,
      blood_requests
    };
  } 
  export async function updateDonorService(id, data) {
    const { name, gender, date_of_birth, email, phone_number, address, blood_type } = data;
    if (!name || !gender || !date_of_birth || !email || !phone_number || !blood_type) {
      throw new Error('Missing required fields');
    }
    // Split name into first and last
    const nameParts = name.trim().split(' ');
    const first_name = nameParts.shift();
    const last_name = nameParts.join(' ') || '';
    // Get blood_type_id
    const bloodType = await BloodType.findOne({ where: { type: blood_type } });
    if (!bloodType) throw new Error('Invalid blood type');
    // Update user
    const [updated] = await User.update({
      first_name,
      last_name,
      gender,
      dob: date_of_birth,
      email,
      phone_num: phone_number,
      address,
      blood_type_id: bloodType.type_id
    }, {
      where: { user_id: id }
    });
    if (!updated) throw new Error('Donor not found');
    return { message: 'Donor updated successfully' };
  } 
  export async function getAllDonorsService(limit = 10, offset = 0, center_id) {
    // Only include users who have donation records at this center
    const donors = await User.findAll({
      attributes: ['user_id', 'first_name', 'last_name', 'gender', 'phone_num', 'last_donation_date'],
      include: [
        { model: BloodType, attributes: ['type'] },
        {
          model: DonationRecord,
          attributes: [],
          where: { center_id },
          required: true
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['user_id', 'DESC']], // Sort by newest first
      raw: true,
      nest: true
    });
    return donors;
  }
  
  export async function getDonorDetailsByIdService(userId) {
    // Get user and blood type
    const user = await User.findOne({
      where: { user_id: userId },
      include: [
        { model: BloodType, attributes: ['type'] }
      ]
    });
    if (!user) return null;
  
    // Get last donation record
    const lastDonation = await DonationRecord.findOne({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
  
    // Get total donations
    const totalDonations = await DonationRecord.count({ where: { user_id: userId } });
  
    // Get appointments
    const appointments = await Appointment.findAll({
      where: { user_id: userId },
      include: [
        { model: DonationCenter, attributes: ['name'] }
      ],
      order: [['date_time', 'DESC']],
      limit: 5
    });
  
    // Get blood requests
    const bloodRequests = await BloodRequest.findAll({
      where: { user_id: userId },
      include: [
        { model: MedicalStaff, attributes: ['first_name', 'last_name'] }
      ],
      order: [['request_date', 'DESC']],
      limit: 5
    });
  
      return {
    user,
    lastDonation,
    totalDonations,
    appointments,
    bloodRequests
  };
}

// Helper function to create blood inventory from donation
async function createBloodInventoryFromDonation(donationRecord, bloodTypeId, centerId) {
  try {
    // Calculate expiry date (42 days from collection date)
    const collectedDate = new Date(donationRecord.date);
    const expiryDate = new Date(collectedDate);
    expiryDate.setDate(expiryDate.getDate() + 42); // Blood expires in 42 days

    // Create blood record
    const bloodRecord = await Blood.create({
      donation_id: donationRecord.donation_id,
      blood_type_id: bloodTypeId,
      volume: donationRecord.volume,
      collected_date: donationRecord.date,
      expiry_date: expiryDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    });

    // Create blood inventory record
    await BloodInventory.create({
      blood_id: bloodRecord.blood_id,
      center_id: centerId,
      quantity_units: 1, // Each donation creates 1 unit
      status: 'Available',
      last_update: new Date().toISOString().split('T')[0] // Current date
    });

    console.log(`Blood inventory created for donation ${donationRecord.donation_id}`);
  } catch (error) {
    console.error('Error creating blood inventory:', error);
    throw new Error(`Failed to create blood inventory: ${error.message}`);
  }
}
  