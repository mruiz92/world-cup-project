// In your React component (e.g., App.js)

import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Not connected');

  useEffect(() => {
    fetch('http://localhost:4000/test-connection')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Connection Status:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
