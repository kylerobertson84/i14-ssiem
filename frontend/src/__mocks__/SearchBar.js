import React from 'react';

const MockSearchBar = ({ query, setQuery }) => {
    return (
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%", border: '1px solid #030000', zIndex: "1" }}
        />
    );
};

export default MockSearchBar;
