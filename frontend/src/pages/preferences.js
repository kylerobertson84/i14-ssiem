import React, {useEffect, useState} from 'react';
import Navbar from '../components/NavBar';
import PreferencesForm from '../components/PreferencesForm.js';
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
          <p>Name: john</p>   {/* user.username*/}
          <p> Email: Email@gmail.com</p>
          <p>Roles:  </p>  {/* {user.role_id}*/}

        </div>
        <div>
          <PreferencesForm/>
        </div>
        <div>
          <SearchBar/>
        </div>
      
      </div>

    );
  };
  
  export default Preferences;

  
  function SearchBar() {
    const [query, setQuery] = useState ("");
    const [results, setResults] = useState ([]);
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
            <span style={ {color: "#4285F4"}}>Search For User</span>
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
{/* */}