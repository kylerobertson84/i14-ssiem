
// src/pages/preferences.js

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import PreferencesForm from '../components/PreferencesForm.js';
import { fetchUser } from '../services/apiService.js';

//import {IoPersonCirculeOutline} from "react-icons/io5"; 

const Preferences = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData] = await Promise.all([
          fetchUser(),
        ]);

        setUser(userData);
        
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
    };

    loadData();
  }, []);

  
  return (
    <div className='profile'>
      <Navbar />
      <h1>Preferences Page</h1>
      <div className='avatar'>
        {/* <div className='avatar-wrapper'>
            {user.avatar (
              <IoPersonCirculeOutline/>
            )}
          </div>
          */}
      </div>
      <div className='body'>
        {!user ? (
          <p>Loading user data...</p>
        ) : (
          <>
            <p>Username: {user.username}</p>
            <p>Email: {user.email || 'No email provided'}</p>
            
            <p>Roles: {user.role ? user.role.name : 'No role assigned'}</p>
          </>
        )}
      </div>
      <div>
        <PreferencesForm />
      </div>
      <div>
        <SearchBar />
      </div>

    </div>

  );
};

export default Preferences;


function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{
        position: "absolute",
        top: "25%",
        left: "5%",
        transform: "translate(-50% )",
        fontSize: '2em'
      }}>
        <span style={{ color: "#4285F4" }}>Search For User</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50% )",
        }}
      >
        {/*<SearchBar query={query} setQuery={setQuery}/>*/} {/* causes the page not to load*/}
      </div>
    </div>
  );
}
{/* */ }