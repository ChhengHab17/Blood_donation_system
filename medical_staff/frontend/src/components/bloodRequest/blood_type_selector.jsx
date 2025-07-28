const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function BloodTypeSelector({ selectedType, onTypeSelect }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Blood Type Needed</label>
      <div className="grid grid-cols-4 gap-3">
        {bloodTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeSelect(type)}
            className={`px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
              selectedType === type
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
