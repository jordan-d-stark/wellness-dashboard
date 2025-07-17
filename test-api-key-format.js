const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing with API Key format (Token prefix)');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

// Get recent dates
const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const testEndpoint = async (url, description, authMethod) => {
  try {
    console.log(`\n📊 Testing: ${description}`);
    console.log(`URL: ${url}`);
    console.log(`Auth: ${authMethod}`);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authMethod === 'Bearer') {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    } else if (authMethod === 'Token') {
      headers['Authorization'] = `Token ${API_KEY}`;
    } else if (authMethod === 'API-Key') {
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
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
      return { success: true, data, authMethod };
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
  const authMethods = ['Bearer', 'Token', 'API-Key'];
  
  // Test different authentication methods
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Different Authentication Methods');
  console.log('='.repeat(80));
  
  for (const authMethod of authMethods) {
    console.log(`\n--- Testing ${authMethod} authentication ---`);
    
    // Test attributes endpoint first
    await testEndpoint(`${baseUrl}/attributes/`, `Attributes list`, authMethod);
    
    // Test one attribute
    await testEndpoint(
      `${baseUrl}/attributes/steps/?date_min=${weekAgo.toISOString().split('T')[0]}&date_max=${today.toISOString().split('T')[0]}`,
      `Steps data`,
      authMethod
    );
  }
  
  // Test API v1 with different auth methods
  console.log('\n' + '='.repeat(80));
  console.log('TEST: API v1 with Different Auth Methods');
  console.log('='.repeat(80));
  
  const v1BaseUrl = 'https://exist.io/api/1';
  const username = 'jordandstark';
  
  for (const authMethod of authMethods) {
    console.log(`\n--- Testing API v1 with ${authMethod} ---`);
    
    await testEndpoint(
      `${v1BaseUrl}/users/${username}/attributes/steps/?date_min=${weekAgo.toISOString().split('T')[0]}&date_max=${today.toISOString().split('T')[0]}`,
      `Steps data (v1)`,
      authMethod
    );
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('TESTING COMPLETE');
  console.log('='.repeat(80));
};

main().catch(console.error); 