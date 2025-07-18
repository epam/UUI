import fs from 'fs';
import path from 'path';
import { getComponentSummariesLookup, readDocsGenResultsJson } from '../utils/docsGen';

interface DocItem {
    id: string;
    name: string;
    component?: any;
    examples?: DocItemExample[];
    parentId?: string;
    order?: number;
    tags?: string[];
}

interface DocItemExample {
    name?: string;
    componentPath?: any;
    descriptionPath?: string;
    onlyCode?: boolean;
    cx?: any;
    themes?: string[];
}

const componentsDocsMapCache = new Map<string, DocItem>();

export function getComponentsDocsList() {
    if (componentsDocsMapCache.size > 0) {
        return componentsDocsMapCache;
    }

    const docsDir = path.resolve(__dirname, '../../../public/docs/pages');

    function readFilesRecursively(dir) {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
            if (entry === 'package.json') continue;

            const fullPath = path.join(dir, entry);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                readFilesRecursively(fullPath);
            } else {
                const doc: DocItem = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                if (doc.id) {
                    componentsDocsMapCache.set(doc.id.toLowerCase(), doc);
                }
            }
        }
    }

    readFilesRecursively(docsDir);
    return componentsDocsMapCache;
}

// Find component doc by id or tags
export function findComponentDoc(componentName: string) {
    const lowerName = componentName.toLowerCase();

    const doc = getComponentsDocsList().get(lowerName);

    if (!doc) {
        // try to find docs by tag and name
        const foundByTag = [];
        getComponentsDocsList().forEach((docItem) => {
            const tagsForSearch = docItem.tags || [];
            tagsForSearch.push(docItem.name.toLowerCase());
            if (tagsForSearch.find((tag) => tag.toLowerCase().includes(lowerName))) {
                foundByTag.push(docItem);
            }
        });

        if (foundByTag.length > 0) {
            return foundByTag;
        } else {
            return [];
        }
    } else {
        return [doc];
    }
}

// Helper to find component by fuzzy name
export function findComponentApiByName(name: string) {
    const summaries = getComponentSummariesLookup();
    const lowerName = name.toLowerCase();

    // First try exact match in @epam/uui
    const exactMatch = Object.entries(summaries).find(([, summary]: any) =>
        summary.module.startsWith('@epam/uui')
        && summary.typeName.name.toLowerCase() === lowerName);

    if (exactMatch) return exactMatch[0];

    // Then try fuzzy match in @epam/uui
    const fuzzyMatch = Object.entries(summaries).find(([, summary]: any) =>
        summary.module.startsWith('@epam/uui')
        && summary.typeName.name.toLowerCase().includes(lowerName));

    if (fuzzyMatch) return fuzzyMatch[0];

    // Finally try fuzzy match in any module
    const anyMatch = Object.entries(summaries).find(([, summary]: any) =>
        summary.typeName.name.toLowerCase().includes(lowerName));

    return anyMatch ? anyMatch[0] : null;
}

// Helper to simplify component details
export function simplifyComponentDetails(details) {
    if (!details || !details.props) return { props: [] };

    return {
        props: details.props.map((prop: any) => ({
            name: prop.name,
            type: prop.typeValue?.raw || 'unknown',
            description: prop.comment?.raw?.join('\n') || '',
            required: prop.required || false,
        })),
    };
}

// Cache for component examples
const examplesCache = new Map();

export function getComponentExamples(componentId: string) {
    if (examplesCache.has(componentId)) {
        return examplesCache.get(componentId);
    }

    const examplesDir = path.resolve(__dirname, '../../../app/src/docs/_examples');

    const componentDoc = getComponentsDocsList().get(componentId.toLowerCase());

    if (componentDoc?.examples.length > 0) {
        const examples = componentDoc.examples.map((example) => {
            if (!example.componentPath) return null;

            const result: any = { name: example.name };

            if (!example.onlyCode) {
                result.description = getExampleDescription(example);
            }
            result.code = fs.readFileSync(path.join(examplesDir, example.componentPath), 'utf8');

            return result;
        }).filter((i) => i !== null);

        // Cache the examples
        examplesCache.set(componentId, examples);
        return examples;
    }
}

export function getTextFromJsonDocDescription(node) {
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

export const getDescriptionFileName = (descriptionPath: string): string => {
    return descriptionPath.replace(new RegExp(/\.example.tsx|\./g), '').replace(/\//g, '-').replace(/^-/, '');
};

export function getExampleDescription(example: DocItemExample) {
    const docsDir = path.resolve(__dirname, '../../../public/docs/content');
    const fileName = (example.descriptionPath || getDescriptionFileName(example.componentPath)) + '.json';
    if (!fs.existsSync(path.join(docsDir, fileName))) {
        return; // File does not exist
    }

    const descriptionFile = fs.readFileSync(path.join(docsDir, fileName), 'utf8');
    const content = JSON.parse(descriptionFile);
    return getTextFromJsonDocDescription(content);
}

export function getComponentApi(componentName: string) {
    const shortRef = findComponentApiByName(componentName);
    if (!shortRef) {
        return null;
    }

    const { docsGenTypes } = readDocsGenResultsJson();
    const componentInfo = docsGenTypes[shortRef];
    return simplifyComponentDetails(componentInfo.details);
}
