import React, { useState } from 'react';
import SearchBar from '../components/SearchBar'
import SearchTable from '../components/SearchTable'

const Queries = () => {
 const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchResults([query]);
  };

  const [tableData, setTableData] = useState([
    // Sample data for demonstration
    { device: 'Device 1', ip: '192.168.1.1', time: 'Apr 11 12:00 PM', severity: 'High', process: 'Process A' },
    { device: 'Device 2', ip: '192.168.1.2', time: 'Apr 12 01:00 PM', severity: 'Medium', process: 'Process B' },
    { device: 'Device 3', ip: '192.168.1.3', time: 'Apr 13 02:00 PM', severity: 'Low', process: 'Process C' },
  ]);

  return (
    <div className="app-container">
      <h1>Queries</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="results-container">
      </div>
      <div className="table-container">
        <h2>Data Table:</h2>
        <SearchTable data={tableData} />
      </div>
    </div>
  );
};

export default Queries;
