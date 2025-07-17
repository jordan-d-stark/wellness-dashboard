require('dotenv').config();
const fetch = require('node-fetch');

async function testOAuthDebug() {
  console.log('🔍 Debugging OAuth2 API Calls\n');
  
  // Test different API endpoints and authentication methods
  const tests = [
    {
      name: 'User info with Bearer token',
      url: 'https://exist.io/api/1/users/$self/',
      headers: {
        'Authorization': `Bearer ${process.env.EXIST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'User info with Token prefix',
      url: 'https://exist.io/api/1/users/$self/',
      headers: {
        'Authorization': `Token ${process.env.EXIST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'Attributes with Bearer token',
      url: 'https://exist.io/api/1/users/$self/attributes/',
      headers: {
        'Authorization': `Bearer ${process.env.EXIST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'Attributes with Token prefix',
      url: 'https://exist.io/api/1/users/$self/attributes/',
      headers: {
        'Authorization': `Token ${process.env.EXIST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'API key with Bearer token',
      url: 'https://exist.io/api/1/users/$self/',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_EXIST_API_KEY}`,
        'Content-Type': 'application/json',
      }
    },
    {
      name: 'API key with Token prefix',
      url: 'https://exist.io/api/1/users/$self/',
      headers: {
        'Authorization': `Token ${process.env.REACT_APP_EXIST_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  ];

  console.log('OAuth2 Token found:', process.env.EXIST_ACCESS_TOKEN ? 'Yes' : 'No');
  if (process.env.EXIST_ACCESS_TOKEN) {
    console.log('OAuth2 Token length:', process.env.EXIST_ACCESS_TOKEN.length);
    console.log('OAuth2 Token starts with:', process.env.EXIST_ACCESS_TOKEN.substring(0, 10) + '...');
  }

  console.log('API Key found:', process.env.REACT_APP_EXIST_API_KEY ? 'Yes' : 'No');
  if (process.env.REACT_APP_EXIST_API_KEY) {
    console.log('API Key length:', process.env.REACT_APP_EXIST_API_KEY.length);
    console.log('API Key starts with:', process.env.REACT_APP_EXIST_API_KEY.substring(0, 10) + '...');
  }

  for (const test of tests) {
    console.log(`\n=== ${test.name} ===`);
    console.log(`URL: ${test.url}`);
    
    try {
      const response = await fetch(test.url, {
        headers: test.headers,
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS!');
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
        
        // If this worked, let's try to get more details
        if (test.url.includes('attributes')) {
          console.log('\nAll available attributes:');
          data.objects.forEach(attr => {
            console.log(`  - ${attr.name} (${attr.label})`);
          });
        }
        
        return; // Found a working method
      } else {
        const text = await response.text();
        console.log('❌ Error response preview:', text.substring(0, 200) + '...');
        
        if (response.status === 401) {
          console.log('🔑 Authentication failed');
        } else if (response.status === 403) {
          console.log('🚫 Forbidden - check permissions');
        } else if (response.status === 404) {
          console.log('🔍 Endpoint not found');
        }
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }

  console.log('\n=== All tests failed ===');
  console.log('This suggests the API endpoints may have changed.');
  console.log('Please check: https://developer.exist.io/');
  console.log('Or try accessing your Exist.io account directly to see what data is available.');
}

testOAuthDebug(); 