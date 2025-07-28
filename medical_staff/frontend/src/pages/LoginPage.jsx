import { useState } from "react"
import logo from "../assets/logo.png"
import { loginUser } from "../services/api"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await loginUser(email, password)
      console.log("Login response:", response)
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      alert("Login successful")
      navigate("/donor-management")
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed: " + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <div className="mb-12 flex flex-col items-center">
        <img src={logo} alt="logo" className="w-36 h-36" />
      </div>

      {/* Welcome Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Welcome to Blood Donation!</h1>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Phone Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email or mobile phone number
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Forget Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-red-600 hover:text-red-700 underline">
              Forget password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600">New user ? </span>
          <Link to="/signup" className="text-sm text-red-600 hover:text-red-700 underline font-medium">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}