# Whippy AI MCP Server

A Model Context Protocol (MCP) server that provides seamless access to Whippy AI's communication platform through Claude and other MCP-compatible clients.

## Detailed Installation Guide

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/whippy-ai-mcp-server.git
cd whippy-ai-mcp-server
chmod +x setup.sh run.sh
./setup.sh
```

### 2. Get Your Whippy AI API Key
1. Log into your [Whippy AI account](https://app.whippy.ai)
2. Go to **Settings** → **Developers** tab
3. Create a new API key
4. Copy the API key value

### 3. Configure Claude Desktop
Find your Claude config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Add this configuration (replace the path and API key):
```json
{
  "mcpServers": {
    "whippy": {
      "command": "/full/path/to/whippy-ai-mcp-server/run.sh",
      "env": {
        "WHIPPY_API_KEY": "your_whippy_api_key_here"
      }
    }
  }
}
```

**For custom API endpoints** (development, staging, etc.):
```json
{
  "mcpServers": {
    "whippy": {
      "command": "/full/path/to/whippy-ai-mcp-server/run.sh",
      "env": {
        "WHIPPY_API_KEY": "your_whippy_api_key_here",
        "WHIPPY_API_URL": "https://your-custom-api.example.com/v1"
      }
    }
  }
}
```

### 4. Restart Claude Desktop
Completely quit and restart Claude Desktop.

### 5. Test It Works
In Claude, ask: *"Check if the Whippy API connection is working"*

You should see a successful response confirming the connection! 🎉

**Note:** You don't need to set the API key in your terminal - Claude Desktop will provide it automatically from the config file.

## Features

This MCP server provides a unified `whippy_api` tool that handles all Whippy AI operations:

### 📞 Contact Management
- Create new contacts with phone, email, name, and tags
- Search and filter existing contacts
- Retrieve specific contact details

### 💬 Messaging  
- Send SMS messages with optional media attachments
- Track message delivery and responses

### 🗣️ Conversation Management
- List conversations with status filtering
- Get detailed conversation history with message threads

### 📢 Campaign Management
- Create targeted SMS campaigns
- Schedule campaigns for future delivery
- Track campaign performance and analytics

### 🔄 Sequence Automation
- View automated message sequences
- Add contacts to existing sequences
- Manage follow-up workflows

### 🏥 Health & Diagnostics
- Verify API connectivity and authentication

## Quick Start

### Prerequisites

- Python 3.8 or higher
- A Whippy AI account with API access
- Claude Desktop (for MCP integration)

### Installation

1. **Clone this repository**
```bash
git clone https://github.com/yourusername/whippy-ai-mcp-server.git
cd whippy-ai-mcp-server
```

2. **Run the setup script**
```bash
chmod +x setup.sh run.sh
./setup.sh
```

3. **Get your Whippy AI API key**
   - Log into your Whippy AI account
   - Go to Settings → Developers tab
   - Create a new API key
   - Copy the API key value

4. **Test the server**
```bash
export WHIPPY_API_KEY="your_api_key_here"
./run.sh
```

## Claude Desktop Configuration

### Step 1: Locate Claude Desktop Config

The config file location depends on your operating system:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

### Step 2: Update Configuration

Add this to your Claude Desktop config file (create it if it doesn't exist):

```json
{
  "mcpServers": {
    "whippy": {
      "command": "/full/path/to/whippy-ai-mcp-server/run.sh",
      "env": {
        "WHIPPY_API_KEY": "your_actual_whippy_api_key_here"
      }
    }
  }
}
```

**Important:** Replace `/full/path/to/whippy-ai-mcp-server/` with the actual full path to where you cloned this repository. You can get this by running `pwd` in the project directory.

### Step 3: Restart Claude Desktop

Completely quit and restart Claude Desktop for the changes to take effect.

## Usage Examples

Once configured, you can use natural language with Claude to interact with Whippy AI:

### Contact Management
```
"Create a contact for Sarah Johnson with phone +1555123456 and email sarah@company.com"
```

### Send Messages
```
"Send an SMS to +1555123456 saying 'Thanks for your interest! We'll be in touch soon.'"
```

### View Conversations
```
"Show me the latest 10 conversations"
```

### Create Campaigns
```
"Create an SMS campaign called 'Holiday Sale' with message 'Get 25% off this weekend!' targeting contacts with tag 'customers'"
```

### Manage Sequences
```
"Add the contact with phone +1555123456 to the onboarding sequence"
```

### Health Check
```
"Check if the Whippy API connection is working"
```

## API Tool Reference

The server exposes a single `whippy_api` tool with these parameters:

- **resource** (required): The API resource type
  - `contacts` - Contact management
  - `messages` - SMS messaging
  - `conversations` - Conversation management
  - `campaigns` - Campaign management  
  - `sequences` - Sequence management
  - `health` - Health checks

- **action** (required): The operation to perform
  - `create` - Create new resource
  - `list` - List resources with filtering
  - `get` - Get specific resource by ID
  - `send` - Send messages
  - `add_contacts` - Add contacts to sequences

- **data** (optional): Request body for create/update operations
- **params** (optional): URL parameters for filtering/pagination
- **resource_id** (optional): Specific resource ID for get/update operations

## Project Structure

```
whippy-ai-mcp-server/
├── whippy-mcp.py          # Main MCP server code
├── requirements.txt       # Python dependencies
├── setup.sh              # Setup script
├── run.sh              # Server startup script
└── README.md             # This file
```

## Environment Variables

The server uses these environment variables:

- **WHIPPY_API_KEY** (required): Your Whippy AI API key
- **WHIPPY_API_URL** (optional): Custom API endpoint URL
  - Default: `https://api.whippy.co/v1`
  - Useful for development, staging, or custom deployments

### Development Mode

For development or testing with a custom API endpoint:

```bash
export WHIPPY_API_KEY="your_key"
export WHIPPY_API_URL="https://dev-api.whippy.co/v1"
./run.sh
```

## Development

### Running in Development Mode

```bash
# Activate virtual environment
source whippy-mcp/bin/activate

# Set API key and optional custom URL
export WHIPPY_API_KEY="your_key"
export WHIPPY_API_URL="https://dev-api.whippy.co/v1"  # Optional

# Run server with debug output
python whippy-mcp.py
```

### Adding New Features

The unified `whippy_api` tool makes it easy to add new Whippy AI endpoints:

1. Add new resource types to the `resource` parameter documentation
2. Add endpoint mapping logic in the `whippy_api` function
3. Test with the appropriate action parameters

### Error Handling

The server provides detailed error messages for common issues:

- **Missing API Key**: Set the `WHIPPY_API_KEY` environment variable
- **Invalid API Key**: Check your API key in Whippy AI settings
- **Network Issues**: Verify internet connectivity and API availability
- **Invalid Parameters**: Check resource and action combinations

## Rate Limiting & Best Practices

- The Whippy AI API may have rate limits - the server includes 30-second timeouts
- Contact/conversation limits are capped at 100 per request
- Message limits are capped at 500 per conversation request
- Use specific filtering when retrieving large datasets
- Test with health checks before starting operations

## Troubleshooting

### Server Won't Start
- Ensure Python 3.8+ is installed
- Run the setup script: `./setup.sh`
- Check that the API key environment variable is set
- Verify virtual environment was created: `ls whippy-mcp/`

### Claude Can't Connect
- Double-check the full path in Claude Desktop config
- Ensure the startup script is executable: `chmod +x run.sh`
- Test the script manually: `./run.sh`
- Check Claude Desktop logs for detailed error messages

### API Errors
- Run a health check: *"Check if the Whippy API connection is working"*
- Verify your API key hasn't been disabled in Whippy AI
- Check the Whippy AI status page for service issues

## Security Notes

- Never commit your API key to version control
- Use environment variables for API key storage
- The server runs locally and doesn't expose your API key to external services
- All communication with Whippy AI uses HTTPS

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is provided as-is for educational and development purposes. Please ensure compliance with Whippy AI's terms of service when using their API.

## Support

For issues with this MCP server:
- Check the troubleshooting section above
- Review the [Whippy AI API documentation](https://docs.whippy.ai/reference)
- Open an issue in this repository

For Whippy AI API issues:
- Contact Whippy AI support
- Check their API status page