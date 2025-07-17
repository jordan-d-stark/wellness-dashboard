const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Comprehensive API v2 Data Endpoint Testing');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

// Get recent dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const testEndpoint = async (url, description) => {
  try {
    console.log(`\n📊 Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS!`);
      console.log(`Response keys:`, Object.keys(data));
      console.log(`Data type:`, typeof data);
      
      if (data.results) {
        console.log(`Results count: ${data.results.length}`);
        if (data.results.length > 0) {
          console.log(`Sample result:`, data.results[0]);
        }
      } else if (data.objects) {
        console.log(`Objects count: ${data.objects.length}`);
        if (data.objects.length > 0) {
          console.log(`Sample object:`, data.objects[0]);
        }
      } else if (Array.isArray(data)) {
        console.log(`Array count: ${data.length}`);
        if (data.length > 0) {
          console.log(`Sample item:`, data[0]);
        }
      } else {
        console.log(`Raw data:`, data);
      }
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log(`❌ ${response.status}: ${errorText.substring(0, 200)}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const main = async () => {
  const baseUrl = 'https://exist.io/api/2';
  const attributes = ['steps', 'sleep', 'meditation_min', 'productive_min'];
  
  // Test 1: Check if there's a general data endpoint
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: General Data Endpoints');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/data/`, 'General data endpoint');
  await testEndpoint(`${baseUrl}/values/`, 'General values endpoint');
  await testEndpoint(`${baseUrl}/metrics/`, 'General metrics endpoint');
  
  // Test 2: Try different attribute data patterns
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: Attribute Data Patterns');
  console.log('='.repeat(80));
  
  for (const attr of attributes) {
    console.log(`\n--- Testing ${attr} ---`);
    
    // Pattern 1: Direct attribute endpoint
    await testEndpoint(`${baseUrl}/attributes/${attr}/`, `Direct ${attr} endpoint`);
    
    // Pattern 2: With values suffix
    await testEndpoint(`${baseUrl}/attributes/${attr}/values/`, `${attr} with values suffix`);
    
    // Pattern 3: With data suffix
    await testEndpoint(`${baseUrl}/attributes/${attr}/data/`, `${attr} with data suffix`);
    
    // Pattern 4: With date range
    await testEndpoint(
      `${baseUrl}/attributes/${attr}/?date_min=${weekAgo.toISOString().split('T')[0]}&date_max=${today.toISOString().split('T')[0]}`,
      `${attr} with date range`
    );
    
    // Pattern 5: Different parameter names
    await testEndpoint(
      `${baseUrl}/attributes/${attr}/?from=${weekAgo.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}`,
      `${attr} with from/to parameters`
    );
  }
  
  // Test 3: Try user-specific endpoints
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: User-Specific Endpoints');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/users/me/`, 'Current user info');
  await testEndpoint(`${baseUrl}/users/me/data/`, 'Current user data');
  await testEndpoint(`${baseUrl}/users/me/attributes/`, 'Current user attributes');
  
  for (const attr of attributes) {
    await testEndpoint(`${baseUrl}/users/me/attributes/${attr}/`, `User ${attr} data`);
  }
  
  // Test 4: Try different date formats and ranges
  console.log('\n' + '='.repeat(80));
  console.log('TEST 4: Different Date Formats');
  console.log('='.repeat(80));
  
  const dateFormats = [
    { name: 'Yesterday only', start: yesterday.toISOString().split('T')[0], end: yesterday.toISOString().split('T')[0] },
    { name: 'Past 3 days', start: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
    { name: 'Past week', start: weekAgo.toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
    { name: 'Past month', start: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
  ];
  
  for (const dateFormat of dateFormats) {
    console.log(`\n--- Testing ${dateFormat.name} ---`);
    await testEndpoint(
      `${baseUrl}/attributes/steps/?date_min=${dateFormat.start}&date_max=${dateFormat.end}`,
      `Steps with ${dateFormat.name}`
    );
  }
  
  // Test 5: Try without any parameters
  console.log('\n' + '='.repeat(80));
  console.log('TEST 5: No Parameters');
  console.log('='.repeat(80));
  
  for (const attr of attributes) {
    await testEndpoint(`${baseUrl}/attributes/${attr}/`, `${attr} without parameters`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('TESTING COMPLETE');
  console.log('='.repeat(80));
};

main().catch(console.error); 