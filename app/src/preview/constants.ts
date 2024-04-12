export const PlayWrightInterfaceName = '_uui_playwright_interface';

export const SCREENSHOT_WIDTH_LIMIT = 1280;

export const ERRORS = {
    CONTEXT_IS_UNSUPPORTED: () => 'Context is not supported',
    PREVIEW_IS_UNSUPPORTED: (params: { componentId: string, previewId: string }) => `Component "${params.componentId}" does not have preview "${params.previewId}"`,
    UNKNOWN_COMPONENT_OR_NO_PREVIEW: (params: { componentId: string }) => {
        return [
            `Component "${params.componentId}" is unknown.`,
            'Please make sure such component exists in "app/src/documents/structureComponents.ts" and at least one preview is defined for selected theme/skin.',
        ].join('\n');
    },
    PREVIEW_IS_MISSING: 'Preview ID is missing',
    COMPONENT_IS_MISSING: 'Component ID is missing',
};
