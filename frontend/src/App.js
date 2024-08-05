import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Dashboard from './pages/dashboard';
import Investigations from './pages/investigations';
import Queries from './pages/queries';
import Reports from './pages/reports';

import PrivateRoute from './components/PrivateRoute';



const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        {/* <Route path="/investigations" element={<Investigations />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

