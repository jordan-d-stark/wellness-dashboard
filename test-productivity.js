require('dotenv').config();
const fetch = require('node-fetch');

async function testProductivity() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing Productivity Data\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  if (!API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    const response = await fetch(`https://exist.io/api/2/attributes/with-values/?days=7&attributes=productive_min`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched productivity data');
      console.log('Raw data:', JSON.stringify(data, null, 2));
      
      if (data.results && data.results.length > 0) {
        const productiveData = data.results[0];
        console.log(`\n📊 Productivity attribute: ${productiveData.name} (${productiveData.label})`);
        
        if (productiveData.values) {
          console.log(`\n📈 Values (last 3 days):`);
          productiveData.values.slice(-3).forEach(val => {
            console.log(`  ${val.date}: ${val.value} (raw value)`);
            console.log(`  ${val.date}: ${val.value / 60} (converted to hours)`);
          });
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
  }
}

testProductivity(); 