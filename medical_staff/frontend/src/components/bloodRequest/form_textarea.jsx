export default function FormTextarea({ label, placeholder, required = false, value, onChange, rows = 4 }) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-none"
          required={required}
        />
      </div>
    )
  }