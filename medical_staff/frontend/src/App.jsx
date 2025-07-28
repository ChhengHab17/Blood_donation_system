import {useState, useEffect} from "react";
import "./App.css";
import BloodRequestPage from "./pages/BloodRequestPage";
import ReportPage from "./pages/ReportPage";
import Login from "./pages/loginPage";
import SignUp from "./pages/SignUp";
import BloodInventoryPage from "./pages/BloodInventory";
import DonorManagementPage from "./pages/DonorManagement";
import DonorDetailPage from "./pages/DonorDetail";
import EditDonorPage from "./pages/EditDonor";
import CreateDonorPage from "./pages/CreateDonor";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/center-request" element={<BloodRequestPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/blood-request" element={<BloodRequestPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/blood-inventory" element={<BloodInventoryPage />} />
        <Route path="/donor-management" element={<DonorManagementPage />} />
        <Route
          path="/donor-management/:donorId/details"
          element={<DonorDetailPage />}
        />
        <Route path="/donor-management/:donorId/edit" element={<EditDonorPage />} />
        <Route path="/create-donor" element={<CreateDonorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
