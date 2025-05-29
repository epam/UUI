import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { server } from './server';

const mcpApis = express.Router();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: Record<string, any> = {};

mcpApis.get('/sse', async (_, res) => {
    const transport = new SSEServerTransport('/api/mcp/messages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

mcpApis.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

export { mcpApis };
