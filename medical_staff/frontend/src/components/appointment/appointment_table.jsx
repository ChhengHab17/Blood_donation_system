"use client"
import StatusDropdown from "./status"

const AppointmentTable = ({ appointments, onStatusChange, onAppointmentClick }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DoB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onAppointmentClick(appointment)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.dob}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.bloodType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <StatusDropdown
                    appointment={appointment}
                    onStatusUpdate={onStatusChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppointmentTable
