import React from 'react';
import Navbar from '../components/NavBar';
import AdminForm from '../components/AdminForm';




const Admin = () => {
  return (
    <div>
      <Navbar/>
      <h1>Admin</h1>
      <AdminForm/>
    </div>
  );
};

export default Admin;