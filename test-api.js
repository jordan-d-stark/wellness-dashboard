require('dotenv').config();
const fetch = require('node-fetch');

async function testExistAPI() {
  const API_KEY = process.env.REACT_APP_EXIST_API_KEY;
  
  console.log('API Key found:', API_KEY ? 'Yes' : 'No');
  if (API_KEY) {
    console.log('API Key length:', API_KEY.length);
    console.log('API Key starts with:', API_KEY.substring(0, 10) + '...');
  }

  try {
    // Test 1: Basic user info
    console.log('\n=== Testing basic user info ===');
    const userResponse = await fetch('https://exist.io/api/1/users/$self/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('User response status:', userResponse.status);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('User data:', JSON.stringify(userData, null, 2));
    } else {
      const errorText = await userResponse.text();
      console.log('User error:', errorText);
    }

    // Test 2: Available attributes
    console.log('\n=== Testing available attributes ===');
    const attributesResponse = await fetch('https://exist.io/api/1/users/$self/attributes/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Attributes response status:', attributesResponse.status);
    
    if (attributesResponse.ok) {
      const attributesData = await attributesResponse.json();
      console.log('Available attributes:', JSON.stringify(attributesData, null, 2));
      
      if (attributesData.objects && attributesData.objects.length > 0) {
        console.log('\nAttribute names:');
        attributesData.objects.forEach(attr => {
          console.log(`- ${attr.name} (${attr.label})`);
        });
      } else {
        console.log('No attributes found. You may need to connect data sources first.');
      }
    } else {
      const errorText = await attributesResponse.text();
      console.log('Attributes error:', errorText);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExistAPI(); 