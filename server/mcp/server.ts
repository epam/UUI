import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { addComponentApiTools } from './componentApiTool';

// Create an MCP server
const server = new McpServer({
    name: 'Demo',
    version: '1.0.0',
});

// Register UUI component tools
addComponentApiTools(server);

export { server };
