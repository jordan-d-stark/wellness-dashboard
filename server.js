const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// OAuth2 Configuration
const OAUTH_CONFIG = {
  clientId: process.env.EXIST_CLIENT_ID,
  clientSecret: process.env.EXIST_CLIENT_SECRET,
  redirectUri: 'http://localhost:3001/auth/callback',
  authorizationUrl: 'https://exist.io/oauth2/authorize',
  tokenUrl: 'https://exist.io/oauth2/access_token',
  scopes: 'activity_read+productivity_read+mood_read+sleep_read'
};

// Enable CORS for React app
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003']
}));

app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// OAuth2 Authorization endpoint
app.get('/auth/authorize', (req, res) => {
  if (!OAUTH_CONFIG.clientId) {
    return res.status(400).json({ error: 'OAuth2 client ID not configured' });
  }

  const authUrl = `${OAUTH_CONFIG.authorizationUrl}?` +
    `response_type=code&` +
    `client_id=${OAUTH_CONFIG.clientId}&` +
    `redirect_uri=${encodeURIComponent(OAUTH_CONFIG.redirectUri)}&` +
    `scope=${OAUTH_CONFIG.scopes}`;

  console.log('Redirecting to authorization URL:', authUrl);
  res.redirect(authUrl);
});

// OAuth2 Callback endpoint
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth2 error:', error);
    return res.redirect('http://localhost:3002?error=' + encodeURIComponent(error));
  }

  if (!code) {
    return res.redirect('http://localhost:3002?error=' + encodeURIComponent('No authorization code received'));
  }

  try {
    console.log('Exchanging authorization code for access token...');
    
    const tokenResponse = await fetch(OAUTH_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: OAUTH_CONFIG.clientId,
        client_secret: OAUTH_CONFIG.clientSecret,
        redirect_uri: OAUTH_CONFIG.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      return res.redirect('http://localhost:3002?error=' + encodeURIComponent('Token exchange failed'));
    }

    const tokenData = await tokenResponse.json();
    console.log('Successfully obtained access token');

    // Store the access token (in a real app, you'd store this securely)
    // For now, we'll store it in memory and also set it as an environment variable
    process.env.EXIST_ACCESS_TOKEN = tokenData.access_token;
    
    // Redirect back to the React app with success
    res.redirect('http://localhost:3002?auth=success');
    
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.redirect('http://localhost:3002?error=' + encodeURIComponent('Token exchange error'));
  }
});

// Check authentication status
app.get('/auth/status', (req, res) => {
  const hasToken = !!(process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY);
  res.json({ 
    authenticated: hasToken,
    hasOAuthToken: !!process.env.EXIST_ACCESS_TOKEN,
    hasApiKey: !!process.env.REACT_APP_EXIST_API_KEY
  });
});

// First, let's check what attributes are available
app.get('/api/available-attributes', async (req, res) => {
  try {
    // Try OAuth2 access token first, then fall back to API key
    const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;
    
    if (!API_KEY) {
      return res.status(400).json({ error: 'No authentication token found. Please authenticate with OAuth2 or provide an API key.' });
    }

    console.log('Fetching available attributes...');
    
    const response = await fetch('https://exist.io/api/2/attributes/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch attributes:', response.status);
      return res.status(response.status).json({ error: `Failed to fetch attributes: ${response.status}` });
    }

    const data = await response.json();
    console.log('Available attributes:', data.results?.map(attr => ({ name: attr.name, label: attr.label })) || []);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy API endpoint for Exist.io
app.get('/api/wellness-data', async (req, res) => {
  try {
    // Try OAuth2 access token first, then fall back to API key
    const API_KEY = process.env.EXIST_ACCESS_TOKEN || process.env.REACT_APP_EXIST_API_KEY;
    
    if (!API_KEY) {
      return res.status(400).json({ error: 'No authentication token found. Please authenticate with OAuth2 or provide an API key.' });
    }

    // Get date range for past 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    console.log('Fetching data for date range:', { start, end });

    // Use the correct API v2 endpoint that includes values
    const attributesResponse = await fetch(`https://exist.io/api/2/attributes/with-values/?days=7&attributes=steps,sleep,meditation_min,productive_min`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!attributesResponse.ok) {
      return res.status(attributesResponse.status).json({ error: `Failed to fetch attributes: ${attributesResponse.status}` });
    }

    const attributesData = await attributesResponse.json();
    console.log('Successfully fetched attributes with values');
    console.log('Raw attributes data:', JSON.stringify(attributesData, null, 2));
    
    // Process the data directly from the with-values endpoint
    const wellnessData = {
      steps: [],
      sleep: [],
      meditation: [],
      productivity: [],
    };

    // Map attribute names to our dashboard keys
    const attributeMapping = {
      'steps': 'steps',
      'sleep': 'sleep', 
      'meditation_min': 'meditation',
      'productive_min': 'productivity'
    };

    for (const attr of attributesData.results) {
      console.log(`Processing attribute: ${attr.name} (${attr.label})`);
      const dashboardKey = attributeMapping[attr.name];
      if (dashboardKey && attr.values) {
        const unit = dashboardKey === 'steps' ? 'steps' : 
                    dashboardKey === 'sleep' ? 'hours' : 
                    dashboardKey === 'meditation' ? 'minutes' : 
                    dashboardKey === 'productivity' ? 'hours' : 'hours';
        
        wellnessData[dashboardKey] = attr.values
          .filter(val => val.value !== null) // Filter out null values
          .map(val => {
            const originalValue = val.value;
            const convertedValue = (dashboardKey === 'productivity' || dashboardKey === 'sleep') ? val.value / 60 : val.value;
            console.log(`${dashboardKey}: ${originalValue} -> ${convertedValue} ${unit}`);
            
            // Parse date string directly to avoid timezone issues
            const [year, month, day] = val.date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day); // month is 0-indexed
            return {
              date: dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }),
              value: convertedValue,
              unit,
              originalDate: val.date, // Keep original date for sorting
            };
          })
          .sort((a, b) => {
            const [yearA, monthA, dayA] = a.originalDate.split('-').map(Number);
            const [yearB, monthB, dayB] = b.originalDate.split('-').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA - dateB; // Sort by date (earliest first)
          })
          .map(({ originalDate, ...item }) => item); // Remove originalDate from final output
        
        console.log(`Successfully processed ${dashboardKey}:`, wellnessData[dashboardKey].length, 'entries');
        console.log(`Sample values for ${dashboardKey}:`, wellnessData[dashboardKey].slice(0, 3));
      }
    }

    // If no data was found, return an informative message
    const totalDataPoints = Object.values(wellnessData).reduce((sum, data) => sum + data.length, 0);
    
    if (totalDataPoints === 0) {
      console.log('No wellness data found.');
      return res.status(404).json({ 
        error: 'No wellness data found',
        message: 'You may need to connect data sources in your Exist.io account first.'
      });
    }

    console.log('Successfully fetched wellness data');
    res.json(wellnessData);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/wellness-data`);
}); 