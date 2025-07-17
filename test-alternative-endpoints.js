const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing alternative endpoint patterns');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

const testAlternativePatterns = async (attributeName) => {
  const baseUrl = 'https://exist.io/api/2';
  
  // Test various alternative patterns
  const patterns = [
    // Try without date parameters first
    `${baseUrl}/attributes/${attributeName}/`,
    `${baseUrl}/attributes/${attributeName}/values/`,
    `${baseUrl}/attributes/${attributeName}/data/`,
    
    // Try with different parameter names
    `${baseUrl}/attributes/${attributeName}/?from=2025-07-10&to=2025-07-17`,
    `${baseUrl}/attributes/${attributeName}/?since=2025-07-10&until=2025-07-17`,
    
    // Try different endpoint structures
    `${baseUrl}/data/${attributeName}/`,
    `${baseUrl}/values/${attributeName}/`,
    `${baseUrl}/metrics/${attributeName}/`,
    
    // Try with user context (like API v1)
    `${baseUrl}/users/me/attributes/${attributeName}/`,
    `${baseUrl}/users/me/attributes/${attributeName}/values/`,
    
    // Try different date formats
    `${baseUrl}/attributes/${attributeName}/?date_min=2025-07-10T00:00:00Z&date_max=2025-07-17T23:59:59Z`,
    
    // Try without any parameters
    `${baseUrl}/attributes/${attributeName}/values/`,
  ];

  console.log(`\n📊 Testing ${attributeName}:`);
  
  for (let i = 0; i < patterns.length; i++) {
    const url = patterns[i];
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`  Pattern ${i + 1}: ${response.status} - ${url}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`    ✅ SUCCESS! Found ${data.results?.length || data.objects?.length || 0} data points`);
        console.log(`    Response keys:`, Object.keys(data));
        if (data.results && data.results.length > 0) {
          console.log(`    Sample data:`, data.results[0]);
        }
        return url;
      } else if (response.status === 404) {
        console.log(`    ❌ 404 - Endpoint not found`);
      } else {
        const errorText = await response.text();
        console.log(`    ❌ ${response.status} - ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.log(`  Pattern ${i + 1}: ERROR - ${error.message}`);
    }
  }
  
  return null;
};

const main = async () => {
  const attributes = ['steps', 'sleep', 'meditation_min', 'productive_min'];
  const workingPatterns = {};
  
  for (const attr of attributes) {
    const workingUrl = await testAlternativePatterns(attr);
    if (workingUrl) {
      workingPatterns[attr] = workingUrl;
    }
  }
  
  console.log('\n🎯 Working URL patterns:');
  console.log(workingPatterns);
  
  if (Object.keys(workingPatterns).length === 0) {
    console.log('\n❌ No working patterns found. Let me try one more approach...');
    
    // Try to get all data at once
    console.log('\n🔍 Trying to get all data at once...');
    try {
      const response = await fetch('https://exist.io/api/2/data/', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`All data endpoint: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Found data endpoint');
        console.log('Response keys:', Object.keys(data));
        console.log('Sample data:', data);
      }
    } catch (error) {
      console.log('All data endpoint error:', error.message);
    }
  }
};

main().catch(console.error); 