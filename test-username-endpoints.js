require('dotenv').config();
const fetch = require('node-fetch');

async function testUsernameEndpoints() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing API Endpoints with Different Username Formats\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test different username formats
  const usernameFormats = [
    '$self',           // Original
    'me',              // Alternative 1
    'self',            // Alternative 2
    'user',            // Alternative 3
    'current',         // Alternative 4
    'profile',         // Alternative 5
  ];

  const endpoints = [
    'https://exist.io/api/1/users/{username}/',
    'https://exist.io/api/1/users/{username}/attributes/',
    'https://exist.io/api/1/{username}/',
    'https://exist.io/api/1/{username}/attributes/',
  ];

  for (const endpoint of endpoints) {
    console.log(`\n=== Testing endpoint pattern: ${endpoint} ===`);
    
    for (const username of usernameFormats) {
      const testUrl = endpoint.replace('{username}', username);
      console.log(`  Testing with username: ${username}`);
      console.log(`  URL: ${testUrl}`);
      
      try {
        const response = await fetch(testUrl, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`    Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`    ✅ SUCCESS! Found working endpoint: ${testUrl}`);
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
          
          return { url: testUrl, username, data };
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

  console.log('\n=== All username formats failed ===');
  console.log('The issue might be that we need your actual Exist.io username.');
  console.log('Could you check your Exist.io account and tell us your username?');
  console.log('It might be visible in your profile or account settings.');
  
  return null;
}

testUsernameEndpoints(); 