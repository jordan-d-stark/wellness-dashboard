require('dotenv').config();
const fetch = require('node-fetch');

async function testOAuthAttributes() {
  const CLIENT_ID = process.env.EXIST_CLIENT_ID;
  const CLIENT_SECRET = process.env.EXIST_CLIENT_SECRET;
  
  console.log('🔐 Testing OAuth2 Authentication\n');
  console.log('Client ID found:', CLIENT_ID ? 'Yes' : 'No');
  console.log('Client Secret found:', CLIENT_SECRET ? 'Yes' : 'No');

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.log('❌ Missing OAuth2 credentials. Please check your .env file.');
    return;
  }

  // Step 1: Generate authorization URL
  const authUrl = `https://exist.io/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:3001/auth/callback')}&` +
    `scope=activity_read+productivity_read+custom_read+mood_read+sleep_read+workouts_read+events_read+finance_read+food_read+health_read+location_read+media_read+social_read+weather_read`;

  console.log('\n=== Step 1: Authorization URL ===');
  console.log('Please visit this URL in your browser to authorize the app:');
  console.log(authUrl);
  console.log('\nAfter authorization, you will be redirected to a URL with a "code" parameter.');
  console.log('Copy that code and paste it below.');

  // For now, let's test if we can at least reach the OAuth endpoints
  console.log('\n=== Testing OAuth2 Endpoints ===');
  
  try {
    // Test the authorization endpoint
    const authResponse = await fetch('https://exist.io/oauth2/authorize', {
      method: 'HEAD'
    });
    console.log('OAuth2 authorization endpoint status:', authResponse.status);
    
    // Test the token endpoint
    const tokenResponse = await fetch('https://exist.io/oauth2/access_token', {
      method: 'HEAD'
    });
    console.log('OAuth2 token endpoint status:', tokenResponse.status);
    
  } catch (error) {
    console.log('Error testing OAuth2 endpoints:', error.message);
  }

  console.log('\n=== Alternative: Check API Documentation ===');
  console.log('Since we\'re having trouble with the API, let\'s check the current documentation:');
  console.log('1. Visit: https://developer.exist.io/');
  console.log('2. Look for the current API endpoints');
  console.log('3. Check if the API structure has changed');
  
  console.log('\n=== Manual Attribute Discovery ===');
  console.log('You can also manually check what attributes are available:');
  console.log('1. Log into your Exist.io account');
  console.log('2. Go to your dashboard');
  console.log('3. Look for data sources and attributes');
  console.log('4. Common attributes might include:');
  console.log('   - steps (from activity trackers)');
  console.log('   - sleep_hours (from sleep trackers)');
  console.log('   - mood (from mood tracking)');
  console.log('   - productivity (from productivity apps)');
  console.log('   - workouts (from fitness apps)');
}

testOAuthAttributes(); 