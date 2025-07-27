import {
  User,
  BloodType,
  DonationCenter,
  MedicalStaff,
  EligibilityRecord,
  Appointment,
  DonationRecord,
  Blood,
  BloodInventory,
  BloodRequest,
} from "../models/index.js";
import { Sequelize, Op } from "sequelize";

export const getUsers = async (limit, page) => {
  const offset = (page - 1) * limit;
  // Count total donation records instead of users
  const total = await DonationRecord.count();

  const users = await DonationRecord.findAll({
    attributes: ["donation_id", "volume", "date"],
    include: [
      {
        model: User,
        attributes: ["user_id", "first_name", "last_name"],
        include: [
          {
            model: BloodType,
            attributes: ["type"],
          },
        ],
      },
      {
        model: MedicalStaff,
        attributes: ["first_name", "last_name"],
      },
    ],
    limit: limit,
    offset: offset,
    order: [["date", "DESC"]], // Changed to DESC to show newest donations first
  });

  return {
    meta: {
      totalRecords: total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
    data: users,
  };
};
export const getBloodInventories = async (limit, page) => {
  try {
    const offset = (page - 1) * limit;

    // Get total count of valid inventory records
    const total = await BloodInventory.count({
      include: [
        {
          model: Blood,
          required: true,
          include: [
            {
              model: BloodType,
              required: true,
            },
          ],
        },
      ],
    });

    // Get paginated inventory records
    const bloodInventory = await BloodInventory.findAll({
      attributes: ["inventory_id", "quantity_units"],
      include: [
        {
          model: Blood,
          required: true,
          attributes: ["volume", "expiry_date"],
          include: [
            {
              model: BloodType,
              required: true,
              attributes: ["type"],
            },
          ],
        },
      ],
      order: [["inventory_id", "DESC"]],
      limit: limit,
      offset: offset,
    });

    // Add total_volume to each inventory record
    const inventoryWithTotalVolume = bloodInventory.map((inv) => {
      let total_volume = null;
      if (inv.Blood) {
        total_volume = (inv.Blood.volume || 0) * (inv.quantity_units || 0);
      }
      return { ...inv.toJSON(), total_volume };
    });

    return {
      meta: {
        totalRecords: total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data: inventoryWithTotalVolume,
    };
  } catch (error) {
    console.error("Error in getBloodInventories:", error);
    throw error;
  }
};
export const getTotalVolumeByBloodTypeService = async () => {
  try {
    // Start with BloodType and left join to Blood to ensure we get all blood types
    const result = await BloodType.findAll({
      attributes: [
        ["type", "blood_type"],
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("Blood.volume")),
            0
          ),
          "total_volume",
        ],
      ],
      include: [
        {
          model: Blood,
          attributes: [],
          required: false, // Use left join to get all blood types
          where: {
            expiry_date: {
              [Op.gt]: new Date(), // only fetch non-expired blood
            },
          },
        },
      ],
      group: ["BloodType.type", "BloodType.type_id"],
      raw: true, // Get plain objects directly
    });

    return result.map((item) => ({
      type: item.blood_type,
      totalVolume: parseInt(item.total_volume),
    }));
  } catch (error) {
    console.error("Error fetching total volume by blood type:", error);
    throw error;
  }
};

export const getTotalDonationCount = async () => {
  try {
    const count = await DonationRecord.count();
    return count;
  } catch (error) {
    console.error("Error fetching total donation count:", error);
    throw error;
  }
};
export const getTotalPendingRequestCount = async () => {
  try {
    const count = await BloodRequest.count({
      where: {
        status: "Pending",
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching total pending request count:", error);
    throw error;
  }
};

export const getFilteredDonors = async ({
  page = 1,
  limit = 10,
  blood_type,
  date_from,
  date_to,
}) => {
  try {
    const offset = (page - 1) * limit;

    // Base query for donation records
    const query = {
      attributes: ["donation_id", "volume", "date"],
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name"],
          include: [
            {
              model: BloodType,
              attributes: ["type"],
              ...(blood_type && { where: { type: blood_type } }),
            },
          ],
        },
        {
          model: MedicalStaff,
          attributes: ["first_name", "last_name"],
        },
      ],
      where: {},
      limit,
      offset,
      order: [["date", "DESC"]],
    };

    // Add date range filter if provided
    if (date_from || date_to) {
      query.where.date = {};
      if (date_from) {
        query.where.date[Op.gte] = new Date(date_from);
      }
      if (date_to) {
        query.where.date[Op.lte] = new Date(date_to);
      }
    }

    // Get total count with filters
    const total = await DonationRecord.count({
      include: query.include,
      where: query.where,
    });

    // Get filtered records
    const donations = await DonationRecord.findAll(query);

    return {
      meta: {
        totalRecords: total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data: donations,
    };
  } catch (error) {
    console.error("Error in getFilteredDonors:", error);
    throw error;
  }
};

export const getFilteredBloodInventories = async ({
  page = 1,
  limit = 10,
  bloodType,
  expiryFrom,
  expiryTo,
}) => {
  try {
    console.log("Received bloodType filter value:", bloodType);
    // Test association path
    const test = await BloodInventory.findOne({
      include: {
        model: Blood,
        include: BloodType,
      },
    });
    console.log("Sample association test:", test?.Blood?.BloodType);
    const offset = (page - 1) * limit;
    let normalizedBloodType = bloodType;
    if (bloodType) {
      // Replace Unicode minus (U+2212) with ASCII hyphen-minus
      normalizedBloodType = bloodType.replace(/\u2212/g, "-");
    }
    const bloodTypeInclude = {
      model: BloodType,
      attributes: ["type"],
      ...(normalizedBloodType && {
        where: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("type")),
          normalizedBloodType.toLowerCase()
        ),
      }),
    };
    const bloodWhere = {};
    if (expiryFrom || expiryTo) {
      bloodWhere.expiry_date = {};
      if (expiryFrom) bloodWhere.expiry_date[Op.gte] = expiryFrom;
      if (expiryTo) bloodWhere.expiry_date[Op.lte] = expiryTo;
    }
    const include = [
      {
        model: Blood,
        required: true,
        attributes: ["volume", "expiry_date"],
        where: Object.keys(bloodWhere).length ? bloodWhere : undefined,
        include: [bloodTypeInclude],
      },
    ];
    const total = await BloodInventory.count({ include });
    const bloodInventory = await BloodInventory.findAll({
      attributes: ["inventory_id", "quantity_units"],
      include,
      order: [["inventory_id", "DESC"]],
      limit,
      offset,
    });
    const inventoryWithTotalVolume = bloodInventory.map((inv) => {
      let total_volume = null;
      if (inv.Blood) {
        total_volume = (inv.Blood.volume || 0) * (inv.quantity_units || 0);
      }
      return { ...inv.toJSON(), total_volume };
    });
    return {
      meta: {
        totalRecords: total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data: inventoryWithTotalVolume,
    };
  } catch (error) {
    console.error("Error in getFilteredBloodInventories:", error);
    throw error;
  }
};
export const createRequest = async (requestData) => {
  try {
    console.log('Service received request data:', requestData);
    console.log('medicalStaffId:', requestData.medicalStaffId);
    console.log('bloodType:', requestData.bloodType);
    console.log('quantity_units:', requestData.quantity_units);
    
    // Validate essential fields
    if (!requestData.medicalStaffId || !requestData.bloodType || !requestData.quantity_units) {
      throw new Error('Missing required fields: medicalStaffId, bloodType, and quantity_units are required');
    }

    // Validate quantity_units
    const quantity = parseInt(requestData.quantity_units);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error('Quantity units must be a positive number');
    }

    // Get blood type ID from blood type string
    const bloodTypeRecord = await BloodType.findOne({
      where: { type: requestData.bloodType }
    });

    if (!bloodTypeRecord) {
      throw new Error(`Blood type '${requestData.bloodType}' not found`);
    }

    // For now, we'll use a default user_id (you might want to get this from authentication)
    // In a real application, this would come from the logged-in user
    const defaultUserId = 1; // You should replace this with actual user authentication

    // Create the request with validated data
    const request = await BloodRequest.create({
      staff_id: requestData.medicalStaffId,
      user_id: defaultUserId || "N/A", 
      blood_type_id: bloodTypeRecord.type_id,
      quantity_units: quantity, // Use the validated quantity
      request_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      status: 'Pending'
    });

    console.log('Created request:', request.toJSON());

    return {
      success: true,
      request_id: request.request_id,
      message: 'Blood request created successfully'
    };
  } catch (error) {
    console.error("Error creating blood request:", error);
    throw error;
  }
};
export const searchByName = async (nameQuery) => {
  if (!nameQuery || typeof nameQuery !== 'string') {
    return [];
  }

  const cleanQuery = nameQuery.trim();
  if (cleanQuery.length === 0) {
    return [];
  }

  try {
    return await MedicalStaff.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${cleanQuery}%` } },
          { last_name: { [Op.iLike]: `%${cleanQuery}%` } },
          Sequelize.where(
            Sequelize.fn('CONCAT', 
              Sequelize.col('first_name'),
              ' ',
              Sequelize.col('last_name')
            ),
            {
              [Op.iLike]: `%${cleanQuery}%`
            }
          )
        ]
      },
      attributes: ['staff_id', 'first_name', 'last_name'],
      limit: 10,
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC']
      ]
    });
  } catch (error) {
    console.error('Error in searchByName:', error);
    return [];
  }
}

