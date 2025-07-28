import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { registerUser, getDonationCenters } from "../services/api"
import { EyeOff } from "lucide-react"
import { Eye } from "lucide-react"

export default function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  
  // Add custom styles for dropdown
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .donation-center-select {
        max-height: 60px;
      }
      .donation-center-select option {
        padding: 8px 12px;
        font-size: 14px;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "staff", // Initialize with default role
    center: "",
    password: "",
    rePassword: "",
  })
  const [donationCenters, setDonationCenters] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    console.log(`Setting ${field} to:`, value)
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Fetch donation centers on component mount
  useEffect(() => {
    const fetchDonationCenters = async () => {
      try {
        setLoading(true)
        const response = await getDonationCenters()
        setDonationCenters(response.data || [])
      } catch (error) {
        console.error('Error fetching donation centers:', error)
        alert('Failed to load donation centers')
      } finally {
        setLoading(false)
      }
    }

    fetchDonationCenters()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate password match
    if (formData.password !== formData.rePassword) {
      alert("Passwords do not match")
      return
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }
    
    // Validate center selection
    if (!formData.center) {
      alert("Please select a donation center")
      return
    }
    
    try {
      console.log("Submitting registration with data:", formData)
      const response = await registerUser(formData.firstName, formData.lastName, formData.email, formData.phoneNumber, formData.role, formData.center, formData.password, formData.rePassword)
      console.log("Registration response:", response)
      alert("Registration successful")
      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed: " + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center">
            <img src={logo} alt="logo" className="w-20 h-20" />
        </div>

        {/* Welcome Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Welcome to Blood Donation!</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* first name Field */}
          <div className="flex flex-row gap-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
                </label>
                <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                />
            </div>

            {/* last name Field */}
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
                </label>
                <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          {/* role */}
          <div className="grid grid-flow-col gap-4">
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
                </label>
                <select
                id="role"
                value={formData.role || "staff"}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                >
                <option value="staff">Staff</option>
                </select>
            </div>
            {/*Donation Centee*/}
            <div>
                <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-2">
                Donation Center
                </label>
                <div className="relative">
                    <select
                    id="center"
                    value={formData.center}
                    onChange={(e) => handleInputChange("center", e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white cursor-pointer donation-center-select"
                    required
                    disabled={loading}
                    >
                    <option value="">Select a donation center</option>
                    {donationCenters.map((center) => (
                        <option key={center.center_id} value={center.center_id}>
                            {center.name} - {center.city}
                        </option>
                    ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {loading && <p className="text-sm text-gray-500 mt-1">Loading centers...</p>}
                {formData.center && (
                    <p className="text-sm text-green-600 mt-1">
                        Selected: {donationCenters.find(c => c.center_id == formData.center)?.name}
                    </p>
                )}
            </div>
          </div>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-gray-400 text-xs">(8+ Characters)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Re-Password Field */}
          <div>
            <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-2">
              Re-Password
            </label>
            <div className="relative">
              <input
                id="rePassword"
                type={showRePassword ? "text" : "password"}
                value={formData.rePassword}
                onChange={(e) => handleInputChange("rePassword", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showRePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Create account
          </button>
          <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-red-600 hover:text-red-700">Login</Link></p>
        </form>
      </div>
    </div>
  )
}
