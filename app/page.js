export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📱 Whippy AI MCP Server
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Model Context Protocol server providing seamless access to Whippy
            AI's communication platform through Claude and other MCP-compatible
            clients.
          </p>
        </div>

        {/* Status Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Server Status
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  MCP Endpoint
                </h3>
                <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "https://your-app.vercel.app"}
                  /api/mcp
                </code>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">API Base</h3>
                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  https://api.whippy.co/v1
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Available Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "👥",
                title: "Contact Management",
                description:
                  "Create, search, and manage contacts with phone numbers, emails, and tags.",
              },
              {
                icon: "💬",
                title: "SMS Messaging",
                description:
                  "Send SMS messages with optional media attachments and delivery tracking.",
              },
              {
                icon: "🗣️",
                title: "Conversations",
                description:
                  "View and manage conversation threads with message history.",
              },
              {
                icon: "📢",
                title: "Campaigns",
                description:
                  "Create targeted SMS campaigns with scheduling and analytics.",
              },
              {
                icon: "🔄",
                title: "Sequences",
                description:
                  "Manage automated message sequences and follow-up workflows.",
              },
              {
                icon: "🏥",
                title: "Health Checks",
                description:
                  "Monitor API connectivity and authentication status.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              🔧 Client Configuration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Claude Desktop
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    {`{
  "mcpServers": {
    "whippy": {
      "url": "${typeof window !== "undefined" ? window.location.origin : "https://your-app.vercel.app"}/api/mcp",
      "env": {
        "WHIPPY_API_KEY": "your_whippy_api_key_here"
      }
    }
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Usage Examples
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>
                      •{" "}
                      <em>
                        "Create a contact named John with phone +1234567890"
                      </em>
                    </li>
                    <li>
                      •{" "}
                      <em>
                        "Send an SMS to +1555123456 saying 'Hello from our
                        system!'"
                      </em>
                    </li>
                    <li>
                      • <em>"Show me recent conversations"</em>
                    </li>
                    <li>
                      •{" "}
                      <em>
                        "Create a campaign called 'Summer Sale' targeting VIP
                        customers"
                      </em>
                    </li>
                    <li>
                      • <em>"Check if the Whippy API is working"</em>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Powered by{" "}
            <a
              href="https://modelcontextprotocol.io"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Model Context Protocol
            </a>{" "}
            and{" "}
            <a
              href="https://vercel.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
