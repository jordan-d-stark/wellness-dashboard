require('dotenv').config();
const fetch = require('node-fetch');

async function testActualUsername() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  const username = 'jordandstark';
  
  console.log('🔍 Testing API with Actual Username\n');
  console.log('Username:', username);
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test different endpoint patterns with the actual username
  const endpoints = [
    `https://exist.io/api/1/users/${username}/`,
    `https://exist.io/api/1/users/${username}/attributes/`,
    `https://exist.io/api/1/${username}/`,
    `https://exist.io/api/1/${username}/attributes/`,
    `https://exist.io/api/2/users/${username}/`,
    `https://exist.io/api/2/users/${username}/attributes/`,
    `https://exist.io/api/v1/users/${username}/`,
    `https://exist.io/api/v1/users/${username}/attributes/`,
  ];

  const authMethods = [
    { name: 'Bearer', prefix: 'Bearer' },
    { name: 'Token', prefix: 'Token' },
    { name: 'API Key Header', header: 'X-API-Key' },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n=== Testing endpoint: ${endpoint} ===`);
    
    for (const authMethod of authMethods) {
      console.log(`  Auth method: ${authMethod.name}`);
      
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (authMethod.header) {
          headers[authMethod.header] = API_KEY;
        } else {
          headers['Authorization'] = `${authMethod.prefix} ${API_KEY}`;
        }

        const response = await fetch(endpoint, { headers });
        
        console.log(`    Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`    ✅ SUCCESS! Found working endpoint: ${endpoint}`);
          console.log(`    Auth method: ${authMethod.name}`);
          console.log(`    Response keys:`, Object.keys(data));
          
          if (data.objects) {
            console.log(`    Number of objects: ${data.objects.length}`);
            if (data.objects.length > 0) {
              console.log(`    First few objects:`);
              data.objects.slice(0, 5).forEach(obj => {
                console.log(`      - ${obj.name || obj.id}: ${obj.label || 'No label'}`);
              });
            }
          }
          
          // If this is the attributes endpoint, show all available attributes
          if (endpoint.includes('attributes')) {
            console.log(`\n    All available attributes:`);
            data.objects.forEach(attr => {
              console.log(`      - ${attr.name} (${attr.label})`);
            });
          }
          
          return { endpoint, authMethod, data };
        } else if (response.status === 401) {
          console.log(`    ❌ Authentication failed`);
        } else if (response.status === 403) {
          console.log(`    ❌ Forbidden - check permissions`);
        } else if (response.status === 404) {
          console.log(`    ❌ Not found`);
        } else {
          const text = await response.text();
          console.log(`    ❌ Error: ${response.status} - ${text.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`    ❌ Network error: ${error.message}`);
      }
    }
  }

  console.log('\n=== All endpoints failed ===');
  console.log('Even with your actual username, all endpoints are returning 404.');
  console.log('This suggests the Exist.io API structure has changed significantly.');
  console.log('Please check: https://developer.exist.io/');
  
  return null;
}

testActualUsername(); 