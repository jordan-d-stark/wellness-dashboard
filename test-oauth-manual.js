require('dotenv').config();
const fetch = require('node-fetch');

async function testOAuthManual() {
  const CLIENT_ID = process.env.EXIST_CLIENT_ID;
  const CLIENT_SECRET = process.env.EXIST_CLIENT_SECRET;
  
  console.log('🔐 Manual OAuth2 Test\n');
  console.log('Client ID:', CLIENT_ID);
  console.log('Client Secret found:', CLIENT_SECRET ? 'Yes' : 'No');

  // Instructions for the user
  console.log('\n=== Instructions ===');
  console.log('1. Visit this URL in your browser:');
  console.log(`https://exist.io/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3001/auth/callback')}&scope=activity_read+productivity_read+custom_read+mood_read+sleep_read+workouts_read+events_read+finance_read+food_read+health_read+location_read+media_read+social_read+weather_read`);
  console.log('\n2. After authorization, you\'ll be redirected to a URL like:');
  console.log('http://localhost:3001/auth/callback?code=YOUR_AUTHORIZATION_CODE');
  console.log('\n3. Copy the "code" parameter value and paste it below.');
  
  // For now, let's test with a placeholder
  console.log('\n=== Testing with placeholder code ===');
  console.log('(Replace this with your actual authorization code)');
  
  const authCode = 'YOUR_AUTHORIZATION_CODE_HERE'; // Replace this
  
  if (authCode === 'YOUR_AUTHORIZATION_CODE_HERE') {
    console.log('Please replace the placeholder with your actual authorization code and run this script again.');
    return;
  }

  try {
    console.log('\n=== Exchanging code for access token ===');
    
    const tokenResponse = await fetch('https://exist.io/oauth2/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: 'http://localhost:3001/auth/callback',
      }),
    });

    console.log('Token response status:', tokenResponse.status);
    
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      console.log('✅ SUCCESS! Access token obtained');
      console.log('Token data:', JSON.stringify(tokenData, null, 2));
      
      const accessToken = tokenData.access_token;
      
      // Now test the API with the access token
      console.log('\n=== Testing API with access token ===');
      
      const userResponse = await fetch('https://exist.io/api/1/users/$self/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('User API status:', userResponse.status);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ User data retrieved:', JSON.stringify(userData, null, 2));
        
        // Test attributes
        console.log('\n=== Testing attributes ===');
        const attrResponse = await fetch('https://exist.io/api/1/users/$self/attributes/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Attributes API status:', attrResponse.status);
        
        if (attrResponse.ok) {
          const attrData = await attrResponse.json();
          console.log('✅ Attributes retrieved!');
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
        const errorText = await userResponse.text();
        console.log('❌ User API error:', errorText.substring(0, 200));
      }
      
    } else {
      const errorText = await tokenResponse.text();
      console.log('❌ Token exchange failed:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testOAuthManual(); 