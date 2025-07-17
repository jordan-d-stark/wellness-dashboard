require('dotenv').config();
const fetch = require('node-fetch');

async function testAPIv2() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing Exist.io API v2\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test the new API v2 endpoints
  const endpoints = [
    'https://exist.io/api/2/attributes/',
    'https://exist.io/api/2/attributes',
    'https://exist.io/api/2/users/',
    'https://exist.io/api/2/users',
    'https://exist.io/api/2/',
  ];

  const authMethods = [
    { name: 'Bearer', prefix: 'Bearer' },
    { name: 'Token', prefix: 'Token' },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n=== Testing endpoint: ${endpoint} ===`);
    
    for (const authMethod of authMethods) {
      console.log(`  Auth method: ${authMethod.name}`);
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `${authMethod.prefix} ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

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
          console.log(`    ❌ Authentication failed - might need new OAuth2 scopes`);
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

  console.log('\n=== API v2 endpoints failed ===');
  console.log('This might be because:');
  console.log('1. Your OAuth2 token needs the new v2 scopes');
  console.log('2. You need to re-authorize your app');
  console.log('3. The API v2 might not be fully rolled out yet');
  
  return null;
}

testAPIv2(); 