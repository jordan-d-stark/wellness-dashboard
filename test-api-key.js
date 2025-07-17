const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.REACT_APP_EXIST_API_KEY;

console.log('Testing Exist.io API key...');
console.log('API Key (first 10 chars):', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

async function testAPI() {
  try {
    // Test 1: Try to get user info
    console.log('\n1. Testing user endpoint...');
    const userResponse = await fetch('https://exist.io/api/1/users/$self/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('User endpoint status:', userResponse.status);
    console.log('User endpoint headers:', Object.fromEntries(userResponse.headers.entries()));
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('User data:', userData);
    } else {
      const errorText = await userResponse.text();
      console.log('Error response:', errorText.substring(0, 500));
    }

    // Test 2: Try to get attributes
    console.log('\n2. Testing attributes endpoint...');
    const attributesResponse = await fetch('https://exist.io/api/1/users/$self/attributes/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Attributes endpoint status:', attributesResponse.status);
    console.log('Attributes endpoint headers:', Object.fromEntries(attributesResponse.headers.entries()));
    
    if (attributesResponse.ok) {
      const attributesData = await attributesResponse.json();
      console.log('Attributes data:', attributesData);
    } else {
      const errorText = await attributesResponse.text();
      console.log('Error response:', errorText.substring(0, 500));
    }

    // Test 3: Try without $self placeholder
    console.log('\n3. Testing without $self placeholder...');
    const directResponse = await fetch('https://exist.io/api/1/users/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Direct endpoint status:', directResponse.status);
    
    if (directResponse.ok) {
      const directData = await directResponse.json();
      console.log('Direct data:', directData);
    } else {
      const errorText = await directResponse.text();
      console.log('Error response:', errorText.substring(0, 500));
    }

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI(); 