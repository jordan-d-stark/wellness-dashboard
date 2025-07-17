require('dotenv').config();
const fetch = require('node-fetch');

async function testAPI() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');
  if (API_KEY) {
    console.log('API Key length:', API_KEY.length);
    console.log('API Key format check:', API_KEY.includes('%') ? 'URL encoded' : 'Plain text');
  }

  // Test different authentication methods
  const tests = [
    {
      name: 'Bearer token',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'API key in header',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'Authorization header without Bearer',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n=== Testing: ${test.name} ===`);
    
    try {
      const response = await fetch('https://exist.io/api/1/users/$self/', {
        headers: test.headers,
      });

      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! User data:', data);
        return; // Stop if we find a working method
      } else {
        const text = await response.text();
        console.log('Response preview:', text.substring(0, 100) + '...');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  }

  // If all tests fail, let's try the documentation approach
  console.log('\n=== Trying documentation approach ===');
  console.log('Please check: https://developer.exist.io/');
  console.log('Make sure your app has the right permissions and is properly configured.');
}

testAPI(); 