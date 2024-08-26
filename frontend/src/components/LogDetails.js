
import React from 'react';

const LogDetails = ({ log }) => {
  if (!log) {
    return <div>Select a log to view details</div>;
  }

  return (
    <div>
      <h2>Log Details</h2>
      <p><strong>Device:</strong> {log.device}</p>
      <p><strong>IP:</strong> {log.ip}</p>
      <p><strong>Time:</strong> {log.time}</p>
      <p><strong>Severity:</strong> {log.severity}</p>
      <p><strong>Process:</strong> {log.process}</p>
      <p><strong>Details:</strong> {log.details}</p>
    </div>
  );
};

export default LogDetails;
