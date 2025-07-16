import { z } from 'zod';
import {
    getComponentsDocsList, getComponentExamples, getExampleDescription, findComponentDoc,
    getComponentApi,
} from './helpers';

function getComponentsListWithDescriptions() {
    const docsList = getComponentsDocsList();
    const result = [];
    docsList.forEach(({ id, name, parentId, examples }) => {
        const resultItem: any = { id, name, parentId };
        if (examples[0].descriptionPath) {
            const description = getExampleDescription(examples[0]);
            description && (resultItem.description = description);
        }
        result.push(resultItem);
    });

    return result;
}

function getComponentDocInfo(componentName: string) {
    const componentDocs = findComponentDoc(componentName);
    if (componentDocs.length === 0) {
        return {
            error: "Component with this name not found. Try another name or this component doesn't exist in UUI",
        };
    }

    return componentDocs.map((componentDoc) => {
        const result = {
            id: componentDoc.id,
            name: componentDoc.name,
            props: getComponentApi(componentDoc.id),
            examples: getComponentExamples(componentDoc.id),
            description: '',
        };

        // Get component description, this is always example without name and with descriptionPath
        if (componentDoc.examples && componentDoc.examples[0].descriptionPath && !componentDoc.examples[0].name) {
            const description = getExampleDescription(componentDoc.examples[0]);
            if (description) {
                result.description = description;
            }
        }

        return result;
    });
}

/**
 * Registers UUI component API tools with the MCP server
 * @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server
 */
export function addComponentApiTools(server) {
    server.tool(
        'uui-component-api',
        {
            componentName: z.string().describe('Name of the component to look up'),
        },
        async ({ componentName }) => {
            const componentDocInfo = getComponentDocInfo(componentName);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(componentDocInfo, null, 2),
                    },
                ],
            };
        },
    );

    server.tool(
        'uui-components-list',
        {},
        async () => {
            const docsList = getComponentsListWithDescriptions();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(docsList, null, 2),
                    },
                ],
            };
        },
    );
}
