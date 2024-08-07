import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Dashboard from './pages/dashboard';
import Investigations from './pages/investigations';
import Queries from './pages/queries';
import Reports from './pages/reports';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/investigations" element={<Investigations />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
};

export default App;

