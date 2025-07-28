import React, { useEffect, useState } from 'react';
import { getTotalVolumeByBloodType, getTotalDonationCount, getPendingRequestCount } from '../../services/api'; 

export default function StatsCards() {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [donationCount, setDonationCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  useEffect(() => {
    fetchBloodTypes();
    getTotalDonation();
    getPendingRequest();
  }, []);

  const fetchBloodTypes = async () => {
    try {
      const response = await getTotalVolumeByBloodType();
      console.log("API Response:", response); // Debug log
      
      // The backend already returns data in the correct format: { type, totalVolume }
      const formattedData = response.map(item => ({
        type: item.type,
        volume: item.totalVolume // Convert from totalVolume to volume for display
      }));
      
      console.log("Formatted blood types:", formattedData);
      setBloodTypes(formattedData);
    } catch (error) {
      console.error("Error fetching blood types:", error);
      // Set default blood types if API fails
      setBloodTypes([
        { type: "A+", volume: 0 },
        { type: "A-", volume: 0 },
        { type: "B+", volume: 0 },
        { type: "B-", volume: 0 },
        { type: "AB+", volume: 0 },
        { type: "AB-", volume: 0 },
        { type: "O+", volume: 0 },
        { type: "O-", volume: 0 },
      ]);
    }
  };
  const getTotalDonation = async () => {
    try {
      const response = await getTotalDonationCount();
      setDonationCount(response.totalDonationCount);
      console.log("Total Donation Count:", response.totalDonationCount);
    } catch (error) {
      console.error("Error fetching total donation count:", error);
    }
  }
  const getPendingRequest = async () => {
    try {
      const response = await getPendingRequestCount();
      setPendingRequestCount(response.totalPendingRequestCount);
      console.log("Pending Request Count:", response.totalPendingRequestCount);
    } catch (error) {
      console.error("Error fetching pending request count:", error);
    }
  }

    return (
      <div className="grid grid-cols-[1fr_1fr_2fr] gap-1 mb-8">
        {/* Donation Count */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center h-50">
            <h3 className="text-gray-600 text-lg font-medium mb-4 text-center">Donation count</h3>

            <div className="flex-grow flex items-center justify-center w-full">
                <p className="text-4xl font-bold text-gray-800">{donationCount}</p>
            </div>
        </div>
  
        {/* Pending Request */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center h-50">
            <h3 className="text-gray-600 text-lg font-medium mb-4 text-center">Pending Request</h3>

            <div className="flex-grow flex items-center justify-center w-full">
                <p className="text-4xl font-bold text-gray-800">{pendingRequestCount}</p>
            </div>
        </div>
  
        {/* Blood Inventory */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-50">
          <h3 className="text-gray-600 text-lg font-medium mb-4">Blood inventory</h3>
          <div className="grid grid-cols-4 gap-2">
            {bloodTypes.map((blood) => (
              <div key={blood.type} className="text-center p-2 rounded-lg hover:bg-gray-50">
                <div className="text-red-600 font-semibold text-sm">{blood.type}</div>
                <div className="text-gray-600 text-sm mt-1">
                  {blood.volume} ml
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }