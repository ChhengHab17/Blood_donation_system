"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function DonorDetail() {
  const { donorId } = useParams()
  const navigate = useNavigate()
  const [donorData, setDonorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!donorId) return

    // Fetch comprehensive donor data
    fetch(`http://localhost:3000/api/donors/${donorId}/details`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch donor details")
        }
        return res.json()
      })
      .then((data) => {
        console.log("Fetched donor details:", data)
        setDonorData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching donor details:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [donorId])

  const handleBack = () => {
    navigate("/donor-management")
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "completed":
      case "eligible":
        return "text-green-600 bg-green-100"
      case "rejected":
      case "cancelled":
      case "not eligible":
        return "text-red-600 bg-red-100"
      case "pending":
      case "scheduled":
        return "text-yellow-600 bg-yellow-100"
      case "no show":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    const dateFormatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const timeFormatted = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
    return `${dateFormatted} at ${timeFormatted}`
  }
  const handleDelete = () => {
  const confirmed = window.confirm("Are you sure you want to delete this donor?");
  if (!confirmed) return;

  fetch(`http://localhost:3000/api/donors/${donorId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete donor");
      }
      alert("Donor deleted successfully");
      navigate("/donor-management");
    })
    .catch((err) => {
      console.error("Error deleting donor:", err);
      alert("Error deleting donor: " + err.message);
    });
};


  if (loading) {
    return (
      <div className="p-8 bg-[#f8f9fc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500">Loading donor details...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !donorData) {
    return (
      <div className="p-8 bg-[#f8f9fc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBack} className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Donors
          </button>
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500">{error || "Donor not found"}</div>
          </div>
        </div>
      </div>
    )
  }

  const { donor_info, eligibility_record, appointments, donation_history, blood_requests } = donorData

  return (
    <div className="p-8 bg-[#f8f9fc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Donors
            </button>
            <h1 className="text-3xl font-semibold text-[#000000]">{`${donor_info?.first_name} ${donor_info?.last_name}`}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Blood Type:</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {donor_info?.BloodType.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/donor-management/${donorId}/edit`)}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete()}
            className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>

        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1d2433] mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="text-[#1d2433] font-medium">{`${donor_info?.first_name} ${donor_info?.last_name}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="text-[#1d2433]">{donor_info?.gender || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="text-[#1d2433]">{formatDate(donor_info?.dob)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-[#1d2433]">{donor_info?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-[#1d2433]">{donor_info?.phone_num || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="text-[#1d2433] text-right max-w-xs">{donor_info?.address || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Donation:</span>
                <span className="text-[#1d2433]">{formatDate(donor_info?.last_donation_date)}</span>
              </div>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className="bg-[#ffffff] rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1d2433] mb-4">Current Eligibility</h2>
            {eligibility_record ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      eligibility_record.is_eligible ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                    }`}
                  >
                    {eligibility_record.is_eligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check Date:</span>
                  <span className="text-[#1d2433]">{formatDate(eligibility_record.check_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hemoglobin Level:</span>
                  <span className="text-[#1d2433]">{eligibility_record.hemoglobin_level || "N/A"} g/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Pressure:</span>
                  <span className="text-[#1d2433]">{eligibility_record.blood_pressure || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-[#1d2433]">{eligibility_record.weight || "N/A"} kg</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No eligibility record found</p>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div className="mt-8 bg-[#ffffff] rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1d2433] mb-4">Appointments</h2>
          {appointments && appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f9]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Donation Center</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f9]">
                  {appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-[#f8f9fc]">
                      <td className="px-4 py-3 text-sm text-[#1d2433]">
                        {formatDateTime(appointment.date_time)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {appointment.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{appointment.DonationCenter.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments found</p>
          )}
        </div>

        {/* Donation History */}
        <div className="mt-8 bg-[#ffffff] rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1d2433] mb-4">Donation History</h2>
          {donation_history && donation_history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f9]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Volume</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Staff</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Center</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f9]">
                  {donation_history.map((donation, index) => (
                    <tr key={index} className="hover:bg-[#f8f9fc]">
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{formatDate(donation.date)}</td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{donation.volume || "N/A"} mL</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{`${donation.MedicalStaff.first_name} ${donation.MedicalStaff.last_name}`}</td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{donation.DonationCenter.name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No donation history found</p>
          )}
        </div>

        {/* Blood Requests */}
        <div className="mt-8 bg-[#ffffff] rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1d2433] mb-4">Blood Requests</h2>
          {blood_requests && blood_requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f1f3f9]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Request Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#1d2433]">Handling Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f9]">
                  {blood_requests.map((request, index) => (
                    <tr key={index} className="hover:bg-[#f8f9fc]">
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{formatDate(request.request_date)}</td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{request.quantity_units} units</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1d2433]">{`${request.MedicalStaff.first_name} ${request.MedicalStaff.last_name}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No blood requests found</p>
          )}
        </div>
      </div>
    </div>
  )
}
