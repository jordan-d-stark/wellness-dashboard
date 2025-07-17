require('dotenv').config();
const fetch = require('node-fetch');

async function testSleep() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🔍 Testing Sleep Data\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');

  if (!API_KEY) {
    console.log('❌ No API key found');
    return;
  }

  try {
    const response = await fetch(`https://exist.io/api/2/attributes/with-values/?days=7&attributes=sleep`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched sleep data');
      console.log('Raw data:', JSON.stringify(data, null, 2));
      
      if (data.results && data.results.length > 0) {
        const sleepData = data.results[0];
        console.log(`\n📊 Sleep attribute: ${sleepData.name} (${sleepData.label})`);
        console.log(`Value type: ${sleepData.value_type_description}`);
        
        if (sleepData.values) {
          console.log(`\n📈 Values (last 7 days):`);
          sleepData.values.forEach(val => {
            if (val.value !== null) {
              console.log(`  ${val.date}: ${val.value} (raw value)`);
              // Try different conversions
              console.log(`    - As hours: ${val.value / 60}`);
              console.log(`    - As minutes: ${val.value}`);
              console.log(`    - As seconds: ${val.value * 60}`);
            }
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

testSleep(); 