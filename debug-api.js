require('dotenv').config();
const fetch = require('node-fetch');

async function debugAPI() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Debugging Exist.io API Connection\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');
  if (API_KEY) {
    console.log('API Key length:', API_KEY.length);
    console.log('API Key starts with:', API_KEY.substring(0, 10) + '...');
  }

  // Test 1: Check if we can reach Exist.io at all
  console.log('\n=== Test 1: Basic connectivity ===');
  try {
    const response = await fetch('https://exist.io/');
    console.log('Exist.io website status:', response.status);
    if (response.ok) {
      console.log('✅ Can reach Exist.io website');
    }
  } catch (error) {
    console.log('❌ Cannot reach Exist.io:', error.message);
  }

  // Test 2: Try different API endpoints
  console.log('\n=== Test 2: API endpoints ===');
  const endpoints = [
    'https://exist.io/api/1/users/$self/',
    'https://exist.io/api/1/users/me/',
    'https://exist.io/api/1/user/',
    'https://exist.io/api/1/attributes/',
    'https://exist.io/api/1/users/$self/attributes/',
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting: ${endpoint}`);
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
        console.log('✅ SUCCESS!');
        console.log('Response keys:', Object.keys(data));
        if (data.objects) {
          console.log('Number of objects:', data.objects.length);
        }
        return endpoint; // Found working endpoint
      } else if (response.status === 401) {
        console.log('❌ Authentication failed - check API key');
      } else if (response.status === 403) {
        console.log('❌ Forbidden - check app permissions');
      } else if (response.status === 404) {
        console.log('❌ Endpoint not found');
      } else {
        const text = await response.text();
        console.log('Response preview:', text.substring(0, 100) + '...');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  }

  // Test 3: Check if API key format is correct
  console.log('\n=== Test 3: API key format ===');
  if (API_KEY) {
    console.log('API key contains special characters:', /[^a-zA-Z0-9]/.test(API_KEY));
    console.log('API key is URL encoded:', API_KEY.includes('%'));
    
    // Try URL decoding if it looks encoded
    if (API_KEY.includes('%')) {
      try {
        const decodedKey = decodeURIComponent(API_KEY);
        console.log('Decoded API key starts with:', decodedKey.substring(0, 10) + '...');
        
        // Test with decoded key
        console.log('\nTesting with decoded API key...');
        const response = await fetch('https://exist.io/api/1/users/$self/', {
          headers: {
            'Authorization': `Bearer ${decodedKey}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Status with decoded key:', response.status);
        if (response.ok) {
          console.log('✅ SUCCESS with decoded key!');
          return;
        }
      } catch (error) {
        console.log('Error with decoded key:', error.message);
      }
    }
  }

  console.log('\n=== Recommendations ===');
  console.log('1. Check your API key at: https://exist.io/account/apps/');
  console.log('2. Make sure your app is properly configured');
  console.log('3. Check the API documentation at: https://developer.exist.io/');
  console.log('4. Try regenerating your API key');
  console.log('5. Make sure your app has the right permissions (read access to attributes)');
}

debugAPI(); 