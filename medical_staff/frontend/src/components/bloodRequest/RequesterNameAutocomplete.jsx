import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { searchName } from "../../services/api"

export default function RequesterNameAutocomplete({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)

  const performSearch = useCallback(async (input) => {
    if (input.length > 1) {
      try {
        setLoading(true)
        const res = await searchName(input)
        console.log("Search results:", res) // Debug log
        setSuggestions(res.data.data || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error("Failed to fetch medical staff:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  const handleChange = (e) => {
    const input = e.target.value
    onChange(input) // Update requesterName
    setShowSuggestions(false)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(input)
    }, 300) // 300ms delay

    setSearchTimeout(timeout)
  }

  const handleSelect = (staff) => {
    console.log("Selected staff:", staff) // Debug log
    onChange(staff.name)
    onSelect(staff) // send back full staff object (id, name)
    setShowSuggestions(false)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Requester name<span className="text-red-500 ml-1">*</span></label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type medical staff name"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      {loading && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white text-sm px-4 py-2 text-gray-500">
          Loading...
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow z-10 max-h-48 overflow-y-auto">
          {suggestions.map((staff) => (
            <li
              key={staff.id}
              onClick={() => handleSelect(staff)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {staff.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
