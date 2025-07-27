import { useState } from 'react';

export const FilterButton = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [bloodType, setBloodType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleSelect = (option) => {
    if (option === 'Reset') {
      setSelectedOption(null);
      setBloodType('');
      setDateFrom('');
      setDateTo('');
      setIsOpen(false); // Close dropdown after reset
      onApply(null);
    } else {
      setSelectedOption(option);
    }
  };

  const handleApply = () => {
    if (!selectedOption || !onApply) return;

    if (selectedOption === 'Blood Type' && bloodType) {
      onApply({ filterBy: 'bloodType', value: bloodType });
    } else if (selectedOption === 'Donation Date' && dateFrom && dateTo) {
      onApply({ filterBy: 'donationDate', value: { from: dateFrom, to: dateTo } });
    }
    setIsOpen(false);
    setSelectedOption(null); // Reset to default after apply
    setBloodType('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 rounded-lg p-2 w-40 text-white focus:outline-none"
      >
        {selectedOption || 'Filter'}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 p-4 space-y-3">
          {!selectedOption && (
            <ul>
              {['Blood Type', 'Donation Date', 'Reset'].map(option => (
                <li
                  key={option}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {selectedOption === 'Blood Type' && (
            <div>
              <select
                className="w-full border p-2 rounded"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A−">A−</option>
                <option value="B+">B+</option>
                <option value="B−">B−</option>
                <option value="AB+">AB+</option>
                <option value="AB−">AB−</option>
                <option value="O+">O+</option>
                <option value="O−">O−</option>
              </select>
              <button
                onClick={handleApply}
                className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
              >
                Apply
              </button>
            </div>
          )}

          {selectedOption === 'Donation Date' && (
            <div>
              <label className="block mb-1 text-sm text-gray-700 w-40">From:</label>
              <input
                type="date"
                className="w-full border p-2 rounded mb-2"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <label className="block mb-1 text-sm text-gray-700">To:</label>
              <input
                type="date"
                className="w-full border p-2 rounded mb-2"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
              <button
                onClick={handleApply}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
