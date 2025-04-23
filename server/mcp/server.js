const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { addComponentApiTools } = require('./componentApiTool');

// Create an MCP server
const server = new McpServer({
    name: 'Demo',
    version: '1.0.0',
});

// Register UUI component tools
addComponentApiTools(server);

module.exports = { server };
