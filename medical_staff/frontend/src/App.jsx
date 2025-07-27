import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import BloodRequestPage from './pages/BloodRequestPage'
import ReportPage from './pages/ReportPage'
import BloodInventoryPage from './pages/BloodInventory'
import DonorManagementPage from './pages/DonorManagement'
import DonorDetail from './pages/DonorDetail'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/donor-management" replace />} />
        <Route path='/blood-request' element={<BloodRequestPage />} />
        <Route path='/report' element={<ReportPage />} />
        <Route path='/blood-inventory' element={<BloodInventoryPage />} />
        <Route path='/donor-management' element={<DonorManagementPage />} />
        <Route path="/donor-management/:donorId/details" element={<DonorDetail />} />

      </Routes>
    </Router>
  )
}

export default App
