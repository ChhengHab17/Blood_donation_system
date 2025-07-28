"use client"

import { useState } from "react"

export default function CreateDonorAccount() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    gender: "",
    DoB: "",
    blood_type_id: "",
    address: "",
    phone_num: "",
    email: "",
    last_donation_date: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState({})

  const bloodTypes = [
    { id: 1, type: "A+" },
    { id: 2, type: "A-" },
    { id: 3, type: "B+" },
    { id: 4, type: "B-" },
    { id: 5, type: "AB+" },
    { id: 6, type: "AB-" },
    { id: 7, type: "O+" },
    { id: 8, type: "O-" },
  ]

  // You can replace the static bloodTypes array with this function
  const fetchBloodTypes = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/blood-types")
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error("Error fetching blood types:", error)
    }

    // Fallback to static data if API fails
    return [
      { id: 1, type: "A+" },
      { id: 2, type: "A-" },
      { id: 3, type: "B+" },
      { id: 4, type: "B-" },
      { id: 5, type: "AB+" },
      { id: 6, type: "AB-" },
      { id: 7, type: "O+" },
      { id: 8, type: "O-" },
    ]
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required"
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.DoB) newErrors.DoB = "Date of birth is required"
    if (!formData.blood_type_id) newErrors.blood_type_id = "Blood type is required"
    if (!formData.phone_num.trim()) newErrors.phone_num = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.last_donation_date) newErrors.last_donation_date = "Last donation date is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation (optional but if provided, must be at least 8 characters)
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Age validation (must be at least 18)
    if (formData.DoB) {
      const birthDate = new Date(formData.DoB)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        newErrors.DoB = "Donor must be at least 18 years old"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors below" })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("http://localhost:3000/api/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          gender: formData.gender,
          DoB: formData.DoB,
          blood_type_id: Number.parseInt(formData.blood_type_id),
          address: formData.address,
          phone_num: formData.phone_num,
          email: formData.email,
          last_donation_date: formData.last_donation_date,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Donor account created successfully! ${data.message || ""}`,
        })

        // Reset form on success
        setFormData({
          first_name: "",
          last_name: "",
          password: "",
          gender: "",
          DoB: "",
          blood_type_id: "",
          address: "",
          phone_num: "",
          email: "",
          last_donation_date: "",
        })
        setErrors({})
      } else {
        setMessage({
          type: "error",
          text: data.error || data.message || "Failed to create donor account",
        })
      }
    } catch (error) {
      console.error("Network error:", error)
      setMessage({
        type: "error",
        text: "Unable to connect to server. Please check your connection.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      password: "",
      gender: "",
      DoB: "",
      blood_type_id: "",
      address: "",
      phone_num: "",
      email: "",
      last_donation_date: "",
    })
    setErrors({})
    setMessage({ type: "", text: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Donor Account</h1>
          <p className="text-gray-600">Register a new donor in the blood donation system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Donor Information</h2>
            <p className="text-gray-600 mt-1">Please fill in all required information</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.first_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter first name"
                      maxLength={20}
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.last_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter last name"
                      maxLength={50}
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                  </div>

                  <div>
                    <label htmlFor="DoB" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="DoB"
                      value={formData.DoB}
                      onChange={(e) => handleInputChange("DoB", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.DoB ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.DoB && <p className="mt-1 text-sm text-red-600">{errors.DoB}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="blood_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type *
                  </label>
                  <select
                    id="blood_type_id"
                    value={formData.blood_type_id}
                    onChange={(e) => handleInputChange("blood_type_id", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.blood_type_id ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type}
                      </option>
                    ))}
                  </select>
                  {errors.blood_type_id && <p className="mt-1 text-sm text-red-600">{errors.blood_type_id}</p>}
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                      maxLength={50}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone_num" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone_num"
                      value={formData.phone_num}
                      onChange={(e) => handleInputChange("phone_num", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.phone_num ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                      maxLength={20}
                    />
                    {errors.phone_num && <p className="mt-1 text-sm text-red-600">{errors.phone_num}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Account Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password (Optional)
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter password (optional)"
                      maxLength={255}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    <p className="mt-1 text-sm text-gray-500">
                      Leave blank if you don't want to set a password for this donor
                    </p>
                  </div>

                  <div>
                    <label htmlFor="last_donation_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Donation Date *
                    </label>
                    <input
                      type="date"
                      id="last_donation_date"
                      value={formData.last_donation_date}
                      onChange={(e) => handleInputChange("last_donation_date", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        errors.last_donation_date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.last_donation_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_donation_date}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      If this is a new donor, use today's date or a past date
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message.text && (
                <div
                  className={`p-4 rounded-md border ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {message.type === "success" ? (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {message.text}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      Create Donor Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
