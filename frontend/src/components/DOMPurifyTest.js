import React from 'react';
import DOMPurify from 'dompurify';
import { Typography, Button } from '@mui/material';

const DOMPurifyTest = () => {
  const unsafeHTML = `<p>Click this image: <img src="https://via.placeholder.com/150" alt="Clickable Image" onclick="alert('Image clicked! XSS Attack Done!')" /></p>`;

  const handleUnsafeTest = () => {
    // Directly render the unsafe HTML (this will trigger the onclick event without sanitization)
    document.getElementById('unsafe-output').innerHTML = unsafeHTML;
  };

  const handleSafeTest = () => {
    // Sanitize the HTML with DOMPurify and render the sanitized version (onclick should be removed)
    const safeHTML = DOMPurify.sanitize(unsafeHTML);
    document.getElementById('safe-output').innerHTML = safeHTML;
  };

  return (
    <div>
      <Typography variant="h6">DOMPurify Test</Typography>
      <Button variant="outlined" onClick={handleUnsafeTest}>
        Render Unsafe HTML
      </Button>
      <Button variant="outlined" onClick={handleSafeTest} style={{ marginLeft: '10px' }}>
        Render Safe HTML with DOMPurify
      </Button>

      <div>
        <Typography variant="subtitle2">Unsafe Output (Watch for Alert):</Typography>
        <div id="unsafe-output"></div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Typography variant="subtitle2">Safe Output (Sanitized):</Typography>
        <div id="safe-output"></div>
      </div>
    </div>
  );
};

export default DOMPurifyTest;
