#!/bin/bash

echo "🚀 Setting up Wellness Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Exist.io API Configuration
# Get your API key from: https://exist.io/account/apps/
REACT_APP_EXIST_API_KEY=your_exist_api_key_here

# Optional: API Base URL (usually don't need to change this)
REACT_APP_EXIST_API_BASE_URL=https://exist.io/api/1
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your actual Exist.io API key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Exist.io API key"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md" 