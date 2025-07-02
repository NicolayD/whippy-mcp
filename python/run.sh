#!/bin/bash

# Whippy AI MCP Server Run Script
# Works for both Claude Desktop and manual testing

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script directory
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "whippy-mcp" ]; then
    echo "❌ Virtual environment not found at $SCRIPT_DIR/whippy-mcp"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if the main script exists
if [ ! -f "whippy-mcp.py" ]; then
    echo "❌ whippy-mcp.py not found in $SCRIPT_DIR"
    exit 1
fi

# Check if API key is set
if [ -z "$WHIPPY_API_KEY" ]; then
    echo "❌ WHIPPY_API_KEY environment variable is not set"
    echo ""
    echo "For manual testing, set your API key first:"
    echo "export WHIPPY_API_KEY='your_api_key_here'"
    echo "then run ./run.sh again"
    echo ""
    echo "For Claude Desktop usage, make sure the API key is set"
    echo "in your Claude Desktop JSON config file."
    exit 1
fi

# Activate virtual environment
source whippy-mcp/bin/activate

# Run the server
exec python whippy-mcp.py