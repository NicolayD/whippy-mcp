import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

/**
 * Whippy AI MCP Server for Vercel
 *
 * This MCP server provides access to Whippy AI's communication platform
 * through a single unified tool that handles all API operations.
 */

// Base configuration
const BASE_URL = process.env.WHIPPY_API_URL || "https://api.whippy.co/v1";
// Note: No server API key - clients must provide their own

/**
 * Get headers with client-provided API key
 */
function getHeaders(clientApiKey) {
  if (!clientApiKey) {
    throw new Error(
      "API key is required - please set WHIPPY_API_KEY in your MCP client configuration",
    );
  }

  return {
    "X-WHIPPY-KEY": clientApiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

/**
 * Make a request to the Whippy API
 */
async function makeWhippyRequest(
  method,
  endpoint,
  data = null,
  params = null,
  clientApiKey = null,
) {
  try {
    const headers = getHeaders(clientApiKey);
    const url = new URL(`${BASE_URL.replace(/\/$/, "")}${endpoint}`);

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }

    const fetchOptions = {
      method,
      headers,
    };

    // Add body for POST/PUT requests
    if (data && (method === "POST" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        error: `HTTP ${response.status}: ${errorText}`,
        status_code: response.status,
      };
    }

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Parse JSON string or return object as-is
 */
function parseJsonParam(param) {
  if (typeof param === "string") {
    try {
      return JSON.parse(param);
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }
  return param;
}

// Create the MCP handler
const handler = createMcpHandler(
  (server) => {
    server.tool(
      "whippy_api",
      "Universal Whippy AI API tool for all operations",
      {
        resource: z
          .enum([
            "contacts",
            "messages",
            "conversations",
            "campaigns",
            "sequences",
            "health",
          ])
          .describe("The API resource type"),
        action: z
          .enum(["create", "list", "get", "send", "add_contacts", "check"])
          .describe("The action to perform"),
        data: z
          .union([z.object({}).passthrough(), z.string()])
          .optional()
          .describe(
            "Request body data for POST/PUT operations (object or JSON string)",
          ),
        params: z
          .union([z.object({}).passthrough(), z.string()])
          .optional()
          .describe(
            "URL parameters for filtering/pagination (object or JSON string)",
          ),
        resource_id: z
          .string()
          .optional()
          .describe(
            "ID of specific resource for operations like get/update/delete",
          ),
        api_key: z
          .string()
          .optional()
          .describe(
            "Client's Whippy API key (optional, uses server key if not provided)",
          ),
      },
      async ({ resource, action, data, params, resource_id, api_key }) => {
        try {
          // Parse data and params if they're JSON strings
          let parsedData = null;
          let parsedParams = null;

          if (data) {
            parsedData = parseJsonParam(data);
          }

          if (params) {
            parsedParams = parseJsonParam(params);
          }

          // Handle health check
          if (resource === "health" && action === "check") {
            const result = await makeWhippyRequest(
              "GET",
              "/contacts",
              null,
              { limit: 1 },
              api_key,
            );

            if (result.error) {
              return {
                content: [
                  {
                    type: "text",
                    text: `❌ Health check failed: ${result.error}`,
                  },
                ],
              };
            }

            return {
              content: [
                {
                  type: "text",
                  text: `✅ Whippy API connection healthy!\n🔗 API Base: ${BASE_URL}\n🔑 Key source: ${api_key ? "Tool parameter" : "Client environment"}`,
                },
              ],
            };
          }

          // Build endpoint based on resource and action
          let endpoint = "";
          let method = "GET";

          if (resource === "contacts") {
            if (action === "create") {
              endpoint = "/contacts";
              method = "POST";
            } else if (action === "list") {
              endpoint = "/contacts";
              method = "GET";
            } else if (action === "get" && resource_id) {
              endpoint = `/contacts/${resource_id}`;
              method = "GET";
            } else {
              throw new Error(
                `Invalid action '${action}' for resource '${resource}'`,
              );
            }
          } else if (resource === "messages") {
            if (action === "send") {
              endpoint = "/messages";
              method = "POST";
            } else if (action === "list") {
              endpoint = "/messages";
              method = "GET";
            } else {
              throw new Error(
                `Invalid action '${action}' for resource '${resource}'`,
              );
            }
          } else if (resource === "conversations") {
            if (action === "list") {
              endpoint = "/conversations";
              method = "GET";
            } else if (action === "get" && resource_id) {
              endpoint = `/conversations/${resource_id}`;
              method = "GET";
            } else {
              throw new Error(
                `Invalid action '${action}' for resource '${resource}'`,
              );
            }
          } else if (resource === "campaigns") {
            if (action === "create") {
              endpoint = "/campaigns";
              method = "POST";
            } else if (action === "list") {
              endpoint = "/campaigns";
              method = "GET";
            } else if (action === "get" && resource_id) {
              endpoint = `/campaigns/${resource_id}`;
              method = "GET";
            } else {
              throw new Error(
                `Invalid action '${action}' for resource '${resource}'`,
              );
            }
          } else if (resource === "sequences") {
            if (action === "list") {
              endpoint = "/sequences";
              method = "GET";
            } else if (action === "get" && resource_id) {
              endpoint = `/sequences/${resource_id}`;
              method = "GET";
            } else if (action === "add_contacts" && resource_id) {
              endpoint = `/sequences/${resource_id}/contacts`;
              method = "POST";
            } else {
              throw new Error(
                `Invalid action '${action}' for resource '${resource}'`,
              );
            }
          } else {
            throw new Error(
              `Unknown resource: ${resource}. Available resources: contacts, messages, conversations, campaigns, sequences, health`,
            );
          }

          // Apply parameter limits for safety
          if (parsedParams) {
            if (parsedParams.limit) {
              parsedParams.limit = Math.min(parsedParams.limit, 100);
            }
            if (parsedParams.messages_limit) {
              parsedParams.messages_limit = Math.min(
                parsedParams.messages_limit,
                500,
              );
            }
          }

          // Make the API request
          const result = await makeWhippyRequest(
            method,
            endpoint,
            parsedData,
            parsedParams,
            api_key,
          );

          if (result.error) {
            return {
              content: [
                {
                  type: "text",
                  text: `❌ API Error: ${result.error}`,
                },
              ],
            };
          }

          // Format successful response
          const formattedResult = JSON.stringify(result, null, 2);
          return {
            content: [
              {
                type: "text",
                text: `✅ Success!\n\`\`\`json\n${formattedResult}\n\`\`\``,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Error: ${error.message}`,
              },
            ],
          };
        }
      },
    );
  },
  {},
  {
    basePath: "/api/mcp",
  },
);

export { handler as GET, handler as POST, handler as DELETE };

// Configure max duration for Vercel
export const maxDuration = 30;
