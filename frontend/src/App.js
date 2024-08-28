
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './pages/dashboard';
import Investigations from './pages/investigations';
import Queries from './pages/queries';
import Reports from './pages/reports';
import Alerts from './pages/alerts';
import Preferences from './pages/preferences';

import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout';



const App = () => (
  <Router>
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/reports" element={<Reports />} />
            <Route path='/alerts' element={<Alerts/>} />
            <Route path='/preferences' element={<Preferences/>} />
      </Routes>
  </Router>
);
export default App;

