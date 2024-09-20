import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Dashboard from './pages/dashboard';
import Investigations from './pages/investigations';
import Queries from './pages/queries';
import Reports from './pages/reports';
import Alerts from './pages/alerts';
import Preferences from './pages/preferences';
import Footer from './components/Footer';
import Navbar from './components/NavBar';
import AdminPage from './pages/admin.js';
import theme from './Design/Theme.js';

import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <div className="app">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/investigations" element={<Investigations />} />
              <Route path="/queries" element={<Queries />} />
              <Route path="/reports" element={<Reports />} />
              <Route path='/alerts' element={<Alerts />} />
              <Route path='/preferences' element={<Preferences />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </Router>
  </ThemeProvider>
);

export default App;