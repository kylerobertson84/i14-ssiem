import React, {useEffect, useState} from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import AuthService from '../services/AuthService.js';
import API_ENDPOINTS from '../services/apiConfig.js';
//import {IoPersonCirculeOutline} from "react-icons/io5"; 


const Preferences = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Authorization header:', `Bearer ${token}`);
        try {
            const response = await axios.get(API_ENDPOINTS.user, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    }
    fetchUser();
  }, []);

  console.log({user})

    return (
      <div className='profile'>
        <Navbar/>
        <h1>Preferences Page</h1>
        <div className='avatar'>
          {/* <div className='avatar-wrapper'>
            {user.avatar (
              <IoPersonCirculeOutline/>
            )}
          </div>
          */}
        </div>
        <div className = 'body'>
          <p>Name: John</p>
          <p> Email: Email@gmail.com</p>
          <p>Roles: </p>

        </div>

      
      </div>

    );
  };
  
  export default Preferences;

{/* */}