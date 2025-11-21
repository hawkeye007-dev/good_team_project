#!/bin/bash

# Development setup script for Reading List Application

echo "🚀 Reading List Application - Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔑 Creating .env.local file..."
    cat > .env.local << EOF
# OpenRouter API Configuration
# Get your free API key from: https://openrouter.ai

NEXT_PUBLIC_OPENROUTER_API_KEY=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
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start adding article URLs to your reading list"
echo ""
echo "For production deployment:"
echo "  - Run 'npm run build' to create an optimized build"
echo "  - Run 'npm start' to run the production server"
echo ""
