import { useState } from "react"
import FormInput from "./form_input"
import FormTextarea from "./form_textarea"
import BloodTypeSelector from "./blood_type_selector"
import { createBloodRequest } from "../../services/api"
import RequesterNameAutocomplete from "./RequesterNameAutocomplete"
import { useEffect } from "react"

export default function BloodRequestForm() {
  const [formData, setFormData] = useState({
    centerName: "",
    requesterName: "",
    phoneNumber: "",
    bloodType: "A+",
    reason: "",
    quantity_units: "",
    medicalStaffId: null
  })
  useEffect(() => {
    // Initialize form data or fetch initial values if needed
    setFormData({
      centerName: "",
      requesterName: "",
      phoneNumber: "",
      bloodType: "A+",
      reason: "",
      quantity_units: "",
      medicalStaffId: null
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleRequest = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.medicalStaffId) {
      alert("Please select a medical staff member")
      return
    }
    
    if (!formData.quantity_units) {
      alert("Please enter the number of units")
      return
    }
    
    const quantity = parseInt(formData.quantity_units)
    if (isNaN(quantity) || quantity <= 0) {
      alert("Quantity must be a positive number")
      return
    }
    
    try {
      console.log("Sending request data:", formData)
      console.log("medicalStaffId:", formData.medicalStaffId)
      console.log("bloodType:", formData.bloodType)
      console.log("quantity_units:", formData.quantity_units)
      const response = await createBloodRequest(formData)
      console.log("Blood request created successfully:", response)
      
      // Reset form
      setFormData({
        centerName: "",
        requesterName: "",
        phoneNumber: "",
        bloodType: "A+",
        reason: "",
        quantity_units: "",
        medicalStaffId: null
      })
      
      // Show success message to user
      alert("Blood request created successfully!")
    } catch (error) {
      console.error("Error creating blood request:", error)
      // Handle error, e.g., show error message to user
      alert("Failed to create blood request. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        <RequesterNameAutocomplete
          value={formData.requesterName}
          onChange={(value) => updateFormData("requesterName", value)}
          onSelect={(staff) => {
            console.log("Form received staff:", staff) // Debug log
            updateFormData("medicalStaffId", staff.id)
            if (staff.phone_num) {
              console.log("Setting phone number to:", staff.phone_num)
              updateFormData("phoneNumber", staff.phone_num)
            }
          }}
        />

        <FormInput
          label="Phone number"
          type="tel"
          placeholder="Enter your phone number"
          required
          value={formData.phoneNumber}
          onChange={(value) => updateFormData("phoneNumber", value)}
          disabled={!!formData.medicalStaffId}
        />

        <FormInput
          label="Request units"
          type="number"
          placeholder="Enter the number of units"
          required
          value={formData.quantity_units}
          onChange={(value) => updateFormData("quantity_units", value)}
        />
        <BloodTypeSelector
          selectedType={formData.bloodType}
          onTypeSelect={(type) => updateFormData("bloodType", type)}
        />

        <FormTextarea
          label="Reason for Blood"
          placeholder="Enter your reasons"
          required
          value={formData.reason}
          onChange={(value) => updateFormData("reason", value)}
          rows={4}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            onClick={handleRequest}
          >
            Request
          </button>
        </div>
      </form>
    </div>
  )
}