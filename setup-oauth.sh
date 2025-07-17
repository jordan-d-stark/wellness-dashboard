#!/bin/bash

echo "🚀 Setting up OAuth2 for Exist.io Wellness Dashboard"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run the main setup script first:"
    echo "   ./setup.sh"
    exit 1
fi

echo "📋 OAuth2 Setup Instructions:"
echo ""
echo "1. Go to https://exist.io/account/apps/"
echo "2. Click 'Create a new app'"
echo "3. Fill in the following details:"
echo "   - Name: Wellness Dashboard (or any name you prefer)"
echo "   - Description: Personal wellness data dashboard"
echo "   - Redirect URI: http://localhost:3001/auth/callback"
echo "   - Scopes: Select the following:"
echo "     ✓ activity_read"
echo "     ✓ productivity_read" 
echo "     ✓ mood_read"
echo "     ✓ sleep_read"
echo ""
echo "4. After creating the app, you'll get:"
echo "   - Client ID"
echo "   - Client Secret"
echo ""

read -p "Enter your OAuth2 Client ID: " CLIENT_ID
read -p "Enter your OAuth2 Client Secret: " CLIENT_SECRET

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Client ID and Client Secret are required!"
    exit 1
fi

echo ""
echo "📝 Updating .env file..."

# Check if OAuth2 config already exists
if grep -q "EXIST_CLIENT_ID" .env; then
    # Update existing values
    sed -i '' "s/EXIST_CLIENT_ID=.*/EXIST_CLIENT_ID=$CLIENT_ID/" .env
    sed -i '' "s/EXIST_CLIENT_SECRET=.*/EXIST_CLIENT_SECRET=$CLIENT_SECRET/" .env
    echo "✅ Updated existing OAuth2 configuration"
else
    # Add new OAuth2 config
    echo "" >> .env
    echo "# OAuth2 Configuration" >> .env
    echo "EXIST_CLIENT_ID=$CLIENT_ID" >> .env
    echo "EXIST_CLIENT_SECRET=$CLIENT_SECRET" >> .env
    echo "✅ Added OAuth2 configuration"
fi

echo ""
echo "🎉 OAuth2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Click 'Connect with Exist.io (OAuth2)'"
echo "4. Authorize the application in your browser"
echo ""
echo "The app will now use OAuth2 authentication instead of API keys!" 