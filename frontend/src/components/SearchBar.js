import React, { useState } from 'react';


const SearchBar  = ({query, setQuery}) => {
    return (
      <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #030000",
          width: "300px",
          display: "flex",
          justifyContent: "start",
          gap: "0.5em",
          alignItems: "center",
        }}
      >

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            border: '1px solid #030000',
            zIndex: "1",
          }}
        />
      </div>
    );
  }
export default SearchBar