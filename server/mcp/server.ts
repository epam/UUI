import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { addComponentApiTools } from './componentApiTool';

// Create an MCP server
const server = new McpServer({
    name: 'UUI Docs',
    version: '1.0.1',
});

// Register UUI component tools
addComponentApiTools(server);

export { server };
