#!/bin/bash

# Whippy AI MCP Server Setup Script
echo "🚀 Setting up Whippy AI MCP Server..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found. Please install Python 3."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "whippy-mcp" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv whippy-mcp
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source whippy-mcp/bin/activate

# Upgrade pip
echo "📊 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Setup complete!"
    echo ""
    echo "🔑 Next steps:"
    echo "1. Set your API key:"
    echo "   export WHIPPY_API_KEY='your_api_key_here'"
    echo ""
    echo "2. Run the server:"
    echo "   source whippy-mcp/bin/activate"
    echo "   python whippy-mcp.py"
    echo ""
    echo "💡 Tip: You can also create a .env file with your API key"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi