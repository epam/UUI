import { z } from 'zod';
import { getComponentSummariesLookup, readDocsGenResultsJson } from '../utils/docsGen';
import { findComponentByName, simplifyComponentDetails, getComponentExamples } from './helpers';

/**
 * Registers UUI component API tools with the MCP server
 * @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server
 */
export function addComponentApiTools(server) {
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
            const examples = getComponentExamples(componentName);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            name: componentInfo.summary.typeName.name,
                            module: componentInfo.summary.module,
                            props: simplifiedDetails.props,
                            codeExamples: examples,
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
                .filter((summary) => (summary as any).module.startsWith('@epam/uui'))
                .map((summary) => ({
                    name: (summary as any).typeName.name,
                    module: (summary as any).module,
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
