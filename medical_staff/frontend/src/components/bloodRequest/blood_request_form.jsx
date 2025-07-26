import { useState } from "react"
import FormInput from "./form_input"
import FormTextarea from "./form_textarea"
import BloodTypeSelector from "./blood_type_selector"

export default function BloodRequestForm() {
  const [formData, setFormData] = useState({
    centerName: "",
    requesterName: "",
    phoneNumber: "",
    bloodType: "A+",
    reason: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Center name"
          placeholder="Enter your center name"
          required
          value={formData.centerName}
          onChange={(value) => updateFormData("centerName", value)}
        />

        <FormInput
          label="Requester name"
          placeholder="Enter your full name"
          required
          value={formData.requesterName}
          onChange={(value) => updateFormData("requesterName", value)}
        />

        <FormInput
          label="Phone number"
          type="tel"
          placeholder="Enter your phone number"
          required
          value={formData.phoneNumber}
          onChange={(value) => updateFormData("phoneNumber", value)}
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
          >
            Request
          </button>
        </div>
      </form>
    </div>
  )
}