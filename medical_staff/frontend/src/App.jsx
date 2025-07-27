import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BloodRequestPage from './pages/BloodRequestPage'
import ReportPage from './pages/ReportPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
          <Routes>
              <Route path='/center-request' element={<BloodRequestPage />} />
              <Route path='/report' element={<ReportPage />} />
          </Routes>
      </Router>
  )
}

export default App
