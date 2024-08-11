

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          
          const response = await axios.get('http://localhost:8000/accounts/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.username}!</p> : <p>{}</p>}
    </div>
  );
};

export default Dashboard;