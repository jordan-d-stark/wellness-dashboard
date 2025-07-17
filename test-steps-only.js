const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Focused Steps Data Testing');
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
  const baseUrl = 'https://exist.io/api/2';
  
  // Test 1: Try different endpoint patterns for steps
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: Different Steps Endpoint Patterns');
  console.log('='.repeat(80));
  
  const patterns = [
    `${baseUrl}/attributes/steps/`,
    `${baseUrl}/attributes/steps/values/`,
    `${baseUrl}/attributes/steps/data/`,
    `${baseUrl}/attributes/steps/entries/`,
    `${baseUrl}/attributes/steps/points/`,
    `${baseUrl}/data/steps/`,
    `${baseUrl}/values/steps/`,
    `${baseUrl}/metrics/steps/`,
    `${baseUrl}/steps/`,
    `${baseUrl}/steps/data/`,
    `${baseUrl}/steps/values/`,
  ];
  
  for (let i = 0; i < patterns.length; i++) {
    await testEndpoint(patterns[i], `Pattern ${i + 1}: ${patterns[i]}`);
  }
  
  // Test 2: Try with different date formats
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: Different Date Formats');
  console.log('='.repeat(80));
  
  const dateFormats = [
    { name: 'Yesterday only', start: yesterday.toISOString().split('T')[0], end: yesterday.toISOString().split('T')[0] },
    { name: 'Past 3 days', start: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
    { name: 'Past week', start: weekAgo.toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
    { name: 'Past month', start: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0], end: today.toISOString().split('T')[0] },
  ];
  
  for (const dateFormat of dateFormats) {
    console.log(`\n--- Testing ${dateFormat.name} ---`);
    
    // Try with date_min/date_max
    await testEndpoint(
      `${baseUrl}/attributes/steps/?date_min=${dateFormat.start}&date_max=${dateFormat.end}`,
      `Steps with date_min/date_max (${dateFormat.name})`
    );
    
    // Try with start/end
    await testEndpoint(
      `${baseUrl}/attributes/steps/?start=${dateFormat.start}&end=${dateFormat.end}`,
      `Steps with start/end (${dateFormat.name})`
    );
    
    // Try with from/to
    await testEndpoint(
      `${baseUrl}/attributes/steps/?from=${dateFormat.start}&to=${dateFormat.end}`,
      `Steps with from/to (${dateFormat.name})`
    );
  }
  
  // Test 3: Try without any parameters
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: No Parameters');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/attributes/steps/`, 'Steps without parameters');
  await testEndpoint(`${baseUrl}/attributes/steps/values/`, 'Steps values without parameters');
  await testEndpoint(`${baseUrl}/attributes/steps/data/`, 'Steps data without parameters');
  
  console.log('\n' + '='.repeat(80));
  console.log('TESTING COMPLETE');
  console.log('='.repeat(80));
};

main().catch(console.error); 