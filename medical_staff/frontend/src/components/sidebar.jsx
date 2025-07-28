import { useLocation, Link } from "react-router-dom"

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Donor management", path: "/donor-management" },
  { name: "Blood Request", path: "/blood-request" },
  { name: "Blood inventory", path: "/blood-inventory" },
  { name: "Center Request", path: "/center-request" },
  { name: "Appointment", path: "/appointment" },
  { name: "Report", path: "/report" },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" />
              </svg>
            </div>
          </div>
          <div className="text-red-600 font-bold">
            <div className="text-sm">donate</div>
            <div className="text-sm font-black">BLOOD</div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full block px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}