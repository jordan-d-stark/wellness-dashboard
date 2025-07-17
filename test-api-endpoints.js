require('dotenv').config();
const fetch = require('node-fetch');

async function testAPIEndpoints() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing Various API Endpoints\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test different possible API endpoint structures
  const endpoints = [
    // Original endpoints
    'https://exist.io/api/1/users/$self/',
    'https://exist.io/api/1/users/$self/attributes/',
    
    // Alternative user endpoints
    'https://exist.io/api/1/user/',
    'https://exist.io/api/1/me/',
    'https://exist.io/api/1/users/me/',
    
    // Alternative attribute endpoints
    'https://exist.io/api/1/attributes/',
    'https://exist.io/api/1/user/attributes/',
    'https://exist.io/api/1/me/attributes/',
    
    // Different API versions
    'https://exist.io/api/2/users/$self/',
    'https://exist.io/api/v1/users/$self/',
    'https://exist.io/api/v2/users/$self/',
    
    // Different base URLs
    'https://api.exist.io/1/users/$self/',
    'https://api.exist.io/users/$self/',
    
    // Different authentication methods
    'https://exist.io/api/1/users/$self/',
    'https://exist.io/api/1/users/$self/',
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
              data.objects.slice(0, 3).forEach(obj => {
                console.log(`      - ${obj.name || obj.id}: ${obj.label || 'No label'}`);
              });
            }
          }
          
          return { endpoint, authMethod, data };
        } else if (response.status === 401) {
          console.log(`    ❌ Authentication failed`);
        } else if (response.status === 403) {
          console.log(`    ❌ Forbidden`);
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
  console.log('This suggests the Exist.io API may have changed significantly.');
  console.log('Please check: https://developer.exist.io/');
  console.log('Or try accessing your Exist.io account directly to see what data is available.');
  
  return null;
}

testAPIEndpoints(); 