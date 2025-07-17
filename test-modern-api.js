require('dotenv').config();
const fetch = require('node-fetch');

async function testModernAPI() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  const username = 'jordandstark';
  
  console.log('🔍 Testing Modern API Patterns\n');
  console.log('Username:', username);
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test modern API patterns
  const endpoints = [
    // Modern REST patterns
    `https://exist.io/api/v1/users/${username}`,
    `https://exist.io/api/v1/users/${username}/attributes`,
    `https://exist.io/api/v1/attributes`,
    `https://exist.io/api/v1/data`,
    `https://exist.io/api/v1/wellness`,
    
    // Alternative base URLs
    `https://api.exist.io/v1/users/${username}`,
    `https://api.exist.io/v1/attributes`,
    
    // GraphQL endpoint (if they switched to GraphQL)
    `https://exist.io/graphql`,
    `https://api.exist.io/graphql`,
    
    // Webhook or data export endpoints
    `https://exist.io/api/v1/export`,
    `https://exist.io/api/v1/data/export`,
    
    // Simple endpoints
    `https://exist.io/api/v1/me`,
    `https://exist.io/api/v1/profile`,
    `https://exist.io/api/v1/account`,
  ];

  for (const endpoint of endpoints) {
    console.log(`\n=== Testing: ${endpoint} ===`);
    
    try {
      // Test with Bearer token
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS! Found working endpoint: ${endpoint}`);
        console.log('Response keys:', Object.keys(data));
        
        if (data.objects) {
          console.log('Number of objects:', data.objects.length);
          if (data.objects.length > 0) {
            console.log('First few objects:');
            data.objects.slice(0, 3).forEach(obj => {
              console.log(`  - ${obj.name || obj.id}: ${obj.label || 'No label'}`);
            });
          }
        }
        
        return { endpoint, data };
      } else if (response.status === 401) {
        console.log('❌ Authentication failed');
      } else if (response.status === 403) {
        console.log('❌ Forbidden');
      } else if (response.status === 404) {
        console.log('❌ Not found');
      } else {
        const text = await response.text();
        console.log(`❌ Error: ${response.status} - ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }

  console.log('\n=== All modern endpoints failed ===');
  console.log('The Exist.io API appears to have changed significantly.');
  console.log('\n=== Recommendations ===');
  console.log('1. Visit https://developer.exist.io/ for current API docs');
  console.log('2. Check if Exist.io has a new API version or structure');
  console.log('3. Contact Exist.io support about API changes');
  console.log('4. Your dashboard is working with mock data - ready for real data once we find the right endpoints');
  
  return null;
}

testModernAPI(); 