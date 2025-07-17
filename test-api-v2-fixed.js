require('dotenv').config();
const fetch = require('node-fetch');

async function testAPIv2Fixed() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing Exist.io API v2 (Fixed)\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  // Test the working API v2 attributes endpoint
  const endpoint = 'https://exist.io/api/2/attributes/';
  
  console.log(`Testing endpoint: ${endpoint}`);
  
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
      console.log(`✅ SUCCESS! API v2 is working!`);
      console.log(`Response keys:`, Object.keys(data));
      console.log(`Total count: ${data.count}`);
      console.log(`Has next page: ${data.next ? 'Yes' : 'No'}`);
      console.log(`Has previous page: ${data.previous ? 'Yes' : 'No'}`);
      
      if (data.results && data.results.length > 0) {
        console.log(`\n📊 Available attributes (${data.results.length} total):`);
        data.results.forEach(attr => {
          console.log(`  - ${attr.name} (${attr.label})`);
        });
        
        // Look for specific attributes we want for the dashboard
        const dashboardAttributes = {
          steps: data.results.find(attr => 
            attr.name.includes('step') || 
            attr.name.includes('walk') || 
            attr.name.includes('distance')
          ),
          sleep: data.results.find(attr => 
            attr.name.includes('sleep') || 
            attr.name.includes('bed')
          ),
          meditation: data.results.find(attr => 
            attr.name.includes('meditation') || 
            attr.name.includes('mindfulness')
          ),
          productivity: data.results.find(attr => 
            attr.name.includes('productivity') || 
            attr.name.includes('work') || 
            attr.name.includes('focus')
          ),
        };
        
        console.log(`\n🎯 Dashboard attribute mapping:`);
        Object.entries(dashboardAttributes).forEach(([key, attr]) => {
          if (attr) {
            console.log(`  ${key}: ${attr.name} (${attr.label})`);
          } else {
            console.log(`  ${key}: Not found`);
          }
        });
        
        return { endpoint, data, dashboardAttributes };
      } else {
        console.log('No attributes found in the response');
      }
    } else if (response.status === 401) {
      console.log('❌ Authentication failed - you need to re-authorize with new v2 scopes');
    } else if (response.status === 403) {
      console.log('❌ Forbidden - check permissions');
    } else {
      const text = await response.text();
      console.log(`❌ Error: ${response.status} - ${text.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
  }
  
  return null;
}

testAPIv2Fixed(); 