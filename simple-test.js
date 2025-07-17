require('dotenv').config();
const fetch = require('node-fetch');

async function simpleTest() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('Testing API key:', API_KEY ? 'Found' : 'Missing');
  
  try {
    // Test the most basic endpoint
    const response = await fetch('https://exist.io/api/1/users/$self/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API key works! User data:', data.username || 'Unknown user');
    } else {
      console.log('❌ API key failed. Status:', response.status);
      const text = await response.text();
      console.log('Response:', text.substring(0, 200) + '...');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest(); 