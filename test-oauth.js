const fetch = require('node-fetch');

async function testOAuthEndpoints() {
  console.log('🧪 Testing OAuth2 endpoints...\n');

  try {
    // Test 1: Check auth status endpoint
    console.log('1. Testing /auth/status endpoint...');
    const statusResponse = await fetch('http://localhost:3001/auth/status');
    console.log('Status:', statusResponse.status);
    
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('Auth status:', status);
    } else {
      console.log('Error response:', await statusResponse.text());
    }

    // Test 2: Check authorize endpoint (should redirect)
    console.log('\n2. Testing /auth/authorize endpoint...');
    const authResponse = await fetch('http://localhost:3001/auth/authorize', {
      redirect: 'manual' // Don't follow redirects
    });
    console.log('Status:', authResponse.status);
    console.log('Location header:', authResponse.headers.get('location'));
    
    if (authResponse.status === 302) {
      const location = authResponse.headers.get('location');
      if (location && location.includes('exist.io/oauth2/authorize')) {
        console.log('✅ OAuth2 authorization URL is correct');
      } else {
        console.log('❌ OAuth2 authorization URL is incorrect');
      }
    } else {
      console.log('❌ Expected 302 redirect, got:', authResponse.status);
    }

    // Test 3: Test wellness data endpoint (should fail without auth)
    console.log('\n3. Testing /api/wellness-data endpoint (without auth)...');
    const wellnessResponse = await fetch('http://localhost:3001/api/wellness-data');
    console.log('Status:', wellnessResponse.status);
    
    if (wellnessResponse.ok) {
      const data = await wellnessResponse.json();
      console.log('Wellness data:', data);
    } else {
      const error = await wellnessResponse.json();
      console.log('Expected error:', error.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Wait a moment for server to start
setTimeout(testOAuthEndpoints, 2000); 