import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppointmentsPage from './pages/AppointmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<div>Home Page - Coming Soon</div>} />
          <Route path="/blood-request" element={<div>Blood Request - Coming Soon</div>} />
          <Route path="/appointment" element={<AppointmentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;