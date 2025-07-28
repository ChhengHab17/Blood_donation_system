import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Header({ title }) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        window.location.reload();
    };


    useEffect(() => {
      function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      }
      if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      } else {
      document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen]);

    return (
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white-600 rounded-lg flex items-center justify-center">
          <div className="text-white font-bold text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xs">donate</span>
            <span className="text-xs font-black">BLOOD</span>
          </div>
          </div>
        </div>
        </div>

        <h1 className="text-3xl font-bold text-red-600 absolute left-1/2 transform -translate-x-1/2">
        {title}
        </h1>

        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        <span className="text-gray-700 font-medium">Hi,name</span>
        <button
          className="w-10 h-10 bg-gray-300 rounded-full focus:outline-none"
          onClick={() => setIsDropdownOpen((open) => !open)}
        ></button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-22 w-32 bg-white border rounded shadow-lg z-10">
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={logout}
          >
            Logout
          </button>
          </div>
        )}
        </div>
      </div>
      </header>
    )
  }