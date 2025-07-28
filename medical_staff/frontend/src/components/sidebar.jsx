import { useLocation, Link } from "react-router-dom"
import logo from "../assets/logo.png"
const menuItems = [
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
        <div className="flex justify-center">
          <img className='w-30 h-30' src={logo} alt="logo" />
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