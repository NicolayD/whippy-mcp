export async function GET(request) {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Whippy MCP Server is running",
      timestamp: new Date().toISOString(),
      endpoint: "/api/mcp/mcp",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
