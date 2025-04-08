const { z } = require('zod');
const { getComponentSummariesLookup, readDocsGenResultsJson } = require('../utils/docsGen');

// Helper to find component by fuzzy name
function findComponentByName(name) {
    const summaries = getComponentSummariesLookup();
    const lowerName = name.toLowerCase();

    // First try exact match in @epam/uui
    const exactMatch = Object.entries(summaries).find(([_, summary]) =>
        summary.module.startsWith('@epam/uui')
        && summary.typeName.name.toLowerCase() === lowerName);

    if (exactMatch) return exactMatch[0];

    // Then try fuzzy match in @epam/uui
    const fuzzyMatch = Object.entries(summaries).find(([_, summary]) =>
        summary.module.startsWith('@epam/uui')
        && summary.typeName.name.toLowerCase().includes(lowerName));

    if (fuzzyMatch) return fuzzyMatch[0];

    // Finally try fuzzy match in any module
    const anyMatch = Object.entries(summaries).find(([_, summary]) =>
        summary.typeName.name.toLowerCase().includes(lowerName));

    return anyMatch ? anyMatch[0] : null;
}

// Helper to simplify component details
function simplifyComponentDetails(details) {
    if (!details || !details.props) return { props: [] };

    return {
        props: details.props.map((prop) => ({
            name: prop.name,
            type: prop.typeValue?.raw || 'unknown',
            description: prop.comment?.raw?.join('\n') || '',
            required: prop.required || false,
        })),
    };
}

/**
 * Registers UUI component API tools with the MCP server
 * @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server
 */
function addComponentApiTools(server) {
    server.tool(
        'uui-component-api',
        {
            componentName: z.string().describe("Name of the component to look up (can be fuzzy, e.g. 'Button' for '@epam/uui-components/Button')"),
        },
        async ({ componentName }) => {
            const shortRef = findComponentByName(componentName);
            if (!shortRef) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Component "${componentName}" not found.`,
                        },
                    ],
                };
            }

            const { docsGenTypes } = readDocsGenResultsJson();
            const componentInfo = docsGenTypes[shortRef];
            const simplifiedDetails = simplifyComponentDetails(componentInfo.details);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            name: componentInfo.summary.typeName.name,
                            module: componentInfo.summary.module,
                            props: simplifiedDetails.props,
                        }, null, 2),
                    },
                ],
            };
        },
    );

    server.tool(
        'uui-list-components',
        {},
        async () => {
            const summaries = getComponentSummariesLookup();
            const uuiComponents = Object.values(summaries)
                .filter((summary) => summary.module.startsWith('@epam/uui'))
                .map((summary) => ({
                    name: summary.typeName.name,
                    module: summary.module,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(uuiComponents, null, 2),
                    },
                ],
            };
        },
    );
}

module.exports = { addComponentApiTools };
