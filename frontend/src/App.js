
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
<<<<<<< HEAD
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edite <code>src/App.js</code> and save to reload!ab
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
=======
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
>>>>>>> origin/develop
  );
};

export default App;
