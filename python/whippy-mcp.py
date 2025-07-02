#!/usr/bin/env python3
"""
Whippy AI MCP Server using FastMCP

This server provides access to Whippy AI's communication platform through MCP tools.
It implements a single unified tool that handles all API operations.

Requirements:
    pip install -r requirements.txt

Usage:
    python whippy-mcp.py

Configuration:
    Set the WHIPPY_API_KEY environment variable with your Whippy API key.
    Optionally set WHIPPY_API_URL to override the default API endpoint.
"""

import os
import asyncio
import json
from typing import Any, Dict, List, Optional, Union
import httpx
from fastmcp import FastMCP

# Initialize the MCP server
mcp = FastMCP("Whippy AI")

# Base configuration
BASE_URL = os.getenv("WHIPPY_API_URL", "https://api.whippy.co/v1")
API_KEY = os.getenv("WHIPPY_API_KEY")

if not API_KEY:
    raise ValueError("WHIPPY_API_KEY environment variable is required")

# Remove trailing slash if present
BASE_URL = BASE_URL.rstrip("/")

# Common headers for all requests
HEADERS = {
    "X-WHIPPY-KEY": API_KEY,
    "Accept": "application/json",
    "Content-Type": "application/json"
}


async def make_whippy_request(
    method: str, 
    endpoint: str, 
    data: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Make a request to the Whippy API"""
    async with httpx.AsyncClient() as client:
        url = f"{BASE_URL}{endpoint}"
        
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=HEADERS,
                json=data,
                params=params,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_msg = f"HTTP {e.response.status_code}: {e.response.text}"
            return {"error": error_msg, "status_code": e.response.status_code}
        except Exception as e:
            return {"error": str(e)}


@mcp.tool()
async def whippy_api(
    resource: str,
    action: str,
    data: Optional[Union[Dict[str, Any], str]] = None,
    params: Optional[Union[Dict[str, Any], str]] = None,
    resource_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Universal Whippy AI API tool for all operations.
    
    Args:
        resource: The API resource (contacts, messages, conversations, campaigns, sequences)
        action: The action to perform (create, get, list, update, delete, send, add_to_sequence)
        data: Request body data for POST/PUT operations (dict or JSON string)
        params: URL parameters for filtering/pagination (dict or JSON string)
        resource_id: ID of specific resource for operations like get/update/delete
    
    Returns:
        API response from Whippy AI
    
    Examples:
        # Create a contact
        resource="contacts", action="create", data={"phone": "+1234567890", "first_name": "John"}
        
        # Get contacts
        resource="contacts", action="list", params={"limit": 10, "search": "john"}
        
        # Send a message
        resource="messages", action="send", data={"phone": "+1234567890", "body": "Hello!"}
        
        # Get conversations
        resource="conversations", action="list", params={"limit": 5}
        
        # Get specific conversation
        resource="conversations", action="get", resource_id="conv_123"
        
        # Create campaign
        resource="campaigns", action="create", data={"name": "Summer Sale", "message": "Get 20% off!"}
        
        # Get sequences
        resource="sequences", action="list"
        
        # Add contacts to sequence
        resource="sequences", action="add_contacts", resource_id="seq_123", data={"contacts": [{"phone": "+1234567890"}]}
        
        # Health check
        resource="health", action="check"
    """
    
    # Parse data parameter if it's a string
    if data is not None:
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError as e:
                return {
                    "error": f"Invalid JSON in data parameter: {str(e)}",
                    "provided_data": data
                }
        elif not isinstance(data, dict):
            return {
                "error": f"Data parameter must be a dictionary or JSON string, got {type(data).__name__}",
                "provided_data": str(data)
            }
    
    # Parse params parameter if it's a string
    if params is not None:
        if isinstance(params, str):
            try:
                params = json.loads(params)
            except json.JSONDecodeError as e:
                return {
                    "error": f"Invalid JSON in params parameter: {str(e)}",
                    "provided_params": params
                }
        elif not isinstance(params, dict):
            return {
                "error": f"Params parameter must be a dictionary or JSON string, got {type(params).__name__}",
                "provided_params": str(params)
            }
    
    # Handle health check
    if resource == "health" and action == "check":
        try:
            result = await make_whippy_request("GET", "/contacts", params={"limit": 1})
            if "error" in result:
                return {
                    "status": "error",
                    "message": "API key may be invalid or API is unreachable",
                    "details": result["error"]
                }
            else:
                return {
                    "status": "healthy",
                    "message": "Successfully connected to Whippy AI API",
                    "api_base": BASE_URL
                }
        except Exception as e:
            return {
                "status": "error",
                "message": "Failed to connect to Whippy AI API",
                "error": str(e)
            }
    
    # Build endpoint based on resource and action
    endpoint = ""
    method = "GET"
    
    if resource == "contacts":
        if action in ["create", "upsert"]:
            endpoint = "/contacts"
            method = "POST"
        elif action in ["list", "get_all"]:
            endpoint = "/contacts"
            method = "GET"
        elif action == "get" and resource_id:
            endpoint = f"/contacts/{resource_id}"
            method = "GET"
        else:
            return {"error": f"Invalid action '{action}' for resource '{resource}'"}
    
    elif resource == "messages":
        if action in ["send", "create"]:
            endpoint = "/messages"
            method = "POST"
        elif action in ["list", "get_all"]:
            endpoint = "/messages"
            method = "GET"
        else:
            return {"error": f"Invalid action '{action}' for resource '{resource}'"}
    
    elif resource == "conversations":
        if action in ["list", "get_all"]:
            endpoint = "/conversations"
            method = "GET"
        elif action == "get" and resource_id:
            endpoint = f"/conversations/{resource_id}"
            method = "GET"
        else:
            return {"error": f"Invalid action '{action}' for resource '{resource}'"}
    
    elif resource == "campaigns":
        if action in ["create"]:
            endpoint = "/campaigns"
            method = "POST"
        elif action in ["list", "get_all"]:
            endpoint = "/campaigns"
            method = "GET"
        elif action == "get" and resource_id:
            endpoint = f"/campaigns/{resource_id}"
            method = "GET"
        else:
            return {"error": f"Invalid action '{action}' for resource '{resource}'"}
    
    elif resource == "sequences":
        if action in ["list", "get_all"]:
            endpoint = "/sequences"
            method = "GET"
        elif action == "get" and resource_id:
            endpoint = f"/sequences/{resource_id}"
            method = "GET"
        elif action == "add_contacts" and resource_id:
            endpoint = f"/sequences/{resource_id}/contacts"
            method = "POST"
        else:
            return {"error": f"Invalid action '{action}' for resource '{resource}'"}
    
    else:
        return {"error": f"Unknown resource: {resource}. Available resources: contacts, messages, conversations, campaigns, sequences, health"}
    
    # Apply parameter limits for safety
    if params:
        if "limit" in params:
            params["limit"] = min(params["limit"], 100)
        if "messages_limit" in params:
            params["messages_limit"] = min(params["messages_limit"], 500)
    
    # Make the API request
    return await make_whippy_request(method, endpoint, data, params)


if __name__ == "__main__":
    # Print server info
    print("🚀 Starting Whippy AI MCP Server")
    print(f"📡 API Base URL: {BASE_URL}")
    print(f"🔑 API Key: {'✓ Set' if API_KEY else '✗ Missing'}")
    print("\n📋 Available tool:")
    print("  • whippy_api - Universal Whippy AI API tool")
    print("\n🔧 Resource types:")
    print("  • contacts - Manage contacts (create, list, get)")
    print("  • messages - Send SMS messages")
    print("  • conversations - View conversations (list, get)")
    print("  • campaigns - Manage campaigns (create, list, get)")
    print("  • sequences - Manage sequences (list, get, add_contacts)")
    print("  • health - Check API connectivity")
    print("\n🚀 To use this server:")
    print("1. Set WHIPPY_API_KEY environment variable")
    print("2. Optionally set WHIPPY_API_URL (defaults to https://api.whippy.co/v1)")
    print("3. Install dependencies: pip install -r requirements.txt")
    print("4. Run this script: python whippy-mcp.py")
    print("5. Configure your MCP client to use this server")
    
    # Run the server
    mcp.run()