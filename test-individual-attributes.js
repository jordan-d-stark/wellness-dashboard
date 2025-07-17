const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found. Please set EXIST_ACCESS_TOKEN or REACT_APP_EXIST_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing individual attribute data endpoints');
console.log('API Key found:', API_KEY ? 'Yes' : 'No');

const testAttribute = async (attributeName) => {
  const baseUrl = 'https://exist.io/api/2';
  
  // Test different URL patterns
  const patterns = [
    `${baseUrl}/attributes/${attributeName}/?date_min=2025-07-11&date_max=2025-07-17`,
    `${baseUrl}/attributes/${attributeName}/values/?date_min=2025-07-11&date_max=2025-07-17`,
    `${baseUrl}/attributes/${attributeName}/data/?date_min=2025-07-11&date_max=2025-07-17`,
    `${baseUrl}/attributes/${attributeName}/?start=2025-07-11&end=2025-07-17`,
    `${baseUrl}/attributes/${attributeName}/values/?start=2025-07-11&end=2025-07-17`,
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
        return url; // Return the working URL pattern
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
    const workingUrl = await testAttribute(attr);
    if (workingUrl) {
      workingPatterns[attr] = workingUrl;
    }
  }
  
  console.log('\n🎯 Working URL patterns:');
  console.log(workingPatterns);
};

main().catch(console.error); 