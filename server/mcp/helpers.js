const fs = require('fs');
const path = require('path');
const { getComponentSummariesLookup } = require('../utils/docsGen');

// Cache for component examples
const examplesCache = new Map();

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

function getComponentExamples(componentName) {
    // Check cache first
    if (examplesCache.has(componentName)) {
        return examplesCache.get(componentName);
    }

    // Get examples directory path - fix the path resolution to point to app directory
    const examplesDir = path.join(process.cwd(), 'src', 'docs', '_examples');

    try {
        // Find matching folder case-insensitively
        const componentNameLower = componentName.toLowerCase();
        const folders = fs.readdirSync(examplesDir);
        const matchingFolder = folders.find((folder) => folder.toLowerCase() === componentNameLower);

        if (!matchingFolder) {
            examplesCache.set(componentName, []);
            return [];
        }

        const folderPath = path.join(examplesDir, matchingFolder);

        // Read only .example.tsx files
        const files = fs.readdirSync(folderPath)
            .filter((file) => file.endsWith('.example.tsx'));

        // Get content of each file
        const examples = files.map((file) => {
            const filePath = path.join(folderPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            let description = '';

            const docFile = findExampleDescription(componentName, file.split('.')[0], folderPath);

            if (docFile) {
                const doc = JSON.parse(docFile);
                description = getTextFromJsonDocDescription(doc);
            }

            return { name: file, content: content, description: description };
        });

        // Cache the results
        examplesCache.set(componentName, examples);
        return examples;
    } catch (error) {
        console.error(`Error reading examples for ${componentName}:`, error);
        return [];
    }
}

function getTextFromJsonDocDescription(node) {
    let result = '';
    if (Array.isArray(node)) {
        for (const item of node) {
            result += getTextFromJsonDocDescription(item);
        }
    } else if (typeof node === 'object' && node !== null) {
        if (typeof node.text === 'string') {
            result += node.text;
        }
        for (const key of Object.keys(node)) {
            if (key !== 'text') {
                result += getTextFromJsonDocDescription(node[key]);
            }
        }
    }
    return result;
}

/**
 * Finds the documentation JSON file for a single component example and returns its content.
 * @param {string} componentName - The name of the component (e.g., 'PickerInput')
 * @param {string} exampleName - The example name (e.g., 'ArrayPickerInput')
 * @returns {string|null} The file content if found, or null if not found
 */
function findExampleDescription(componentName, exampleName) {
    const docsDir = path.join(process.cwd(), '..', 'public', 'docs', 'content');
    const files = fs.readdirSync(docsDir);
    const match = files.find((file) => {
        const [type, component, fileExampleName] = file.split('.')[0].split('-');
        return type === 'examples' && component === componentName.toLowerCase() && fileExampleName.toLowerCase().includes(exampleName.toLowerCase());
    });
    if (match) {
        const filePath = path.join(docsDir, match);
        return fs.readFileSync(filePath, 'utf8');
    }
    return null;
}

module.exports = {
    findComponentByName,
    simplifyComponentDetails,
    getComponentExamples,
    getTextFromJsonDocDescription,
};
