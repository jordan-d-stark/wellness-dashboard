const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing Exist.io API v1 with OAuth2 token');
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
      
      if (data.objects) {
        console.log(`Objects count: ${data.objects.length}`);
        if (data.objects.length > 0) {
          console.log(`Sample object:`, data.objects[0]);
        }
      } else if (data.results) {
        console.log(`Results count: ${data.results.length}`);
        if (data.results.length > 0) {
          console.log(`Sample result:`, data.results[0]);
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
  const baseUrl = 'https://exist.io/api/1';
  
  // Test 1: Check if API v1 works with OAuth2 token
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: API v1 Basic Endpoints');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/users/me/`, 'Current user info (v1)');
  await testEndpoint(`${baseUrl}/users/me/attributes/`, 'User attributes (v1)');
  
  // Test 2: Try API v1 attribute data endpoints
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: API v1 Attribute Data');
  console.log('='.repeat(80));
  
  const attributes = ['steps', 'sleep', 'meditation_min', 'productive_min'];
  
  for (const attr of attributes) {
    console.log(`\n--- Testing ${attr} (v1) ---`);
    
    // Try different v1 patterns
    await testEndpoint(`${baseUrl}/users/me/attributes/${attr}/`, `User ${attr} (v1)`);
    await testEndpoint(`${baseUrl}/users/me/attributes/${attr}/?date_min=${weekAgo.toISOString().split('T')[0]}&date_max=${today.toISOString().split('T')[0]}`, `User ${attr} with date range (v1)`);
  }
  
  // Test 3: Try with your username
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: API v1 with Username');
  console.log('='.repeat(80));
  
  const username = 'jordandstark'; // Your username from earlier
  
  for (const attr of attributes) {
    console.log(`\n--- Testing ${username}/${attr} (v1) ---`);
    
    await testEndpoint(`${baseUrl}/users/${username}/attributes/${attr}/`, `User ${username} ${attr} (v1)`);
    await testEndpoint(`${baseUrl}/users/${username}/attributes/${attr}/?date_min=${weekAgo.toISOString().split('T')[0]}&date_max=${today.toISOString().split('T')[0]}`, `User ${username} ${attr} with date range (v1)`);
  }
  
  // Test 4: Try different date ranges
  console.log('\n' + '='.repeat(80));
  console.log('TEST 4: Different Date Ranges (v1)');
  console.log('='.repeat(80));
  
  const dateRanges = [
    { name: 'Yesterday only', start: yesterday.toISOString().split('T')[0], end: yesterday.toISOString().split('T')[0] },
    { name: 'Past 3 days', start: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
    { name: 'Past week', start: weekAgo.toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
  ];
  
  for (const dateRange of dateRanges) {
    console.log(`\n--- Testing ${dateRange.name} ---`);
    await testEndpoint(
      `${baseUrl}/users/${username}/attributes/steps/?date_min=${dateRange.start}&date_max=${dateRange.end}`,
      `Steps with ${dateRange.name} (v1)`
    );
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('TESTING COMPLETE');
  console.log('='.repeat(80));
};

main().catch(console.error); 