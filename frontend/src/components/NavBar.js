
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/investigations">Investigations</NavLink></li>
        <li><NavLink to="/queries">Queries</NavLink></li>
        <li><NavLink to="/reports">Reports</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar;
