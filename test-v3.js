require('dotenv').config();
const fetch = require('node-fetch');

async function testAPIv3() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('Testing different API endpoints...\n');

  // Test different API versions and endpoints
  const endpoints = [
    'https://exist.io/api/1/users/$self/',
    'https://exist.io/api/2/users/$self/',
    'https://exist.io/api/v1/users/$self/',
    'https://exist.io/api/users/$self/',
    'https://exist.io/api/1/user/',
    'https://exist.io/api/1/me/',
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Found working endpoint:', endpoint);
        console.log('Data:', JSON.stringify(data, null, 2));
        return endpoint;
      } else if (response.status === 401) {
        console.log('❌ Authentication failed - check API key');
      } else if (response.status === 403) {
        console.log('❌ Forbidden - check app permissions');
      } else {
        console.log('❌ Endpoint not found');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    console.log('');
  }

  console.log('All endpoints failed. Please check:');
  console.log('1. Your API key is correct');
  console.log('2. Your app has the right permissions');
  console.log('3. Your app is properly configured in Exist.io');
  console.log('4. Visit: https://exist.io/account/apps/');
}

testAPIv3(); 