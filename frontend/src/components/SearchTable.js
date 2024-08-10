import React from 'react';
const SearchTable = ({ data }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>IP</th>
            <th>Time</th>
            <th>Severity</th>
            <th>Process</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.device}</td>
              <td>{row.ip}</td>
              <td>{row.time}</td>
              <td>{row.severity}</td>
              <td>{row.process}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchTable;