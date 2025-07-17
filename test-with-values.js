const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing the CORRECT API v2 endpoint: /attributes/with-values/');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

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
      
      if (data.results) {
        console.log(`Results count: ${data.results.length}`);
        
        // Look for our target attributes
        const targetAttributes = ['steps', 'sleep', 'meditation_min', 'productive_min'];
        
        for (const attr of data.results) {
          if (targetAttributes.includes(attr.name)) {
            console.log(`\n🎯 Found ${attr.name} (${attr.label}):`);
            console.log(`  Template: ${attr.template}`);
            console.log(`  Active: ${attr.active}`);
            console.log(`  Values count: ${attr.values?.length || 0}`);
            
            if (attr.values && attr.values.length > 0) {
              console.log(`  Sample value:`, attr.values[0]);
            }
          }
        }
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
  
  // Test 1: Basic with-values endpoint
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: Basic with-values endpoint');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/attributes/with-values/`, 'Basic with-values endpoint');
  
  // Test 2: With days parameter for past week
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: With days parameter (past 7 days)');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/attributes/with-values/?days=7`, 'With 7 days of data');
  
  // Test 3: With specific attributes filter
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: Filtered by specific attributes');
  console.log('='.repeat(80));
  
  await testEndpoint(`${baseUrl}/attributes/with-values/?attributes=steps,sleep,meditation_min,productive_min`, 'Filtered by our target attributes');
  
  // Test 4: With date range
  console.log('\n' + '='.repeat(80));
  console.log('TEST 4: With date range');
  console.log('='.repeat(80));
  
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  await testEndpoint(
    `${baseUrl}/attributes/with-values/?date_max=${today.toISOString().split('T')[0]}&limit=1`, 
    'With date_max parameter'
  );
  
  console.log('\n' + '='.repeat(80));
  console.log('TESTING COMPLETE');
  console.log('='.repeat(80));
};

main().catch(console.error); 