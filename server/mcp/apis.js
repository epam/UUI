const express = require('express');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { server } = require('./server');

const mcpApis = express.Router();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports = {};

mcpApis.get('/sse', async (_, res) => {
    const transport = new SSEServerTransport('/api/mcp/messages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

mcpApis.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

module.exports = { mcpApis };
