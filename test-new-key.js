require('dotenv').config();
const fetch = require('node-fetch');

async function testNewKey() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('🧪 Testing New API Key\n');
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');
  if (API_KEY) {
    console.log('API Key length:', API_KEY.length);
    console.log('API Key starts with:', API_KEY.substring(0, 10) + '...');
  }

  // Test the most basic endpoint first
  console.log('\n=== Testing Basic User Info ===');
  try {
    const response = await fetch('https://exist.io/api/1/users/$self/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! User info retrieved');
      console.log('User data:', JSON.stringify(data, null, 2));
      
      // Now test attributes
      console.log('\n=== Testing Available Attributes ===');
      const attrResponse = await fetch('https://exist.io/api/1/users/$self/attributes/', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Attributes status:', attrResponse.status);
      
      if (attrResponse.ok) {
        const attrData = await attrResponse.json();
        console.log('✅ SUCCESS! Attributes retrieved');
        console.log('Available attributes:');
        
        if (attrData.objects && attrData.objects.length > 0) {
          attrData.objects.forEach(attr => {
            console.log(`- ${attr.name} (${attr.label})`);
          });
        } else {
          console.log('No attributes found. You may need to connect data sources first.');
        }
      } else {
        const errorText = await attrResponse.text();
        console.log('❌ Attributes error:', errorText.substring(0, 200));
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText.substring(0, 200));
      
      if (response.status === 401) {
        console.log('\n🔑 This looks like an authentication issue.');
        console.log('Please check:');
        console.log('1. Your API key is correct');
        console.log('2. Your app is properly configured');
        console.log('3. Your app has the right permissions');
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testNewKey(); 