import "./globals.css";

export const metadata = {
  title: "Whippy AI MCP Server",
  description:
    "Model Context Protocol server for Whippy AI communication platform",
  keywords: ["MCP", "Whippy", "SMS", "Communication", "AI", "Claude"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
