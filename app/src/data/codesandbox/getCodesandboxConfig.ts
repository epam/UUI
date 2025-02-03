export type FilesRecord = Record<string, { isBinary: boolean; content: string }>;
export type CodesandboxFilesRecord = Record<string, string>;

export const getCodesandboxConfig = (content: string, stylesheets: FilesRecord, initialFiles: CodesandboxFilesRecord) => ({
    ...stylesheets,
    'Example.tsx': {
        isBinary: false,
        content,
    },
    'index.tsx': {
        isBinary: false,
        content: initialFiles.indexTSX,
    },
    'settings.ts': {
        isBinary: false,
        content: initialFiles.settingsTS,
    },
    'package.json': {
        isBinary: false,
        content: initialFiles.packageJSON,
    },
    'tsconfig.json': {
        isBinary: false,
        content: initialFiles.tsConfigJSON,
    },
    'index.html': {
        isBinary: false,
        content: initialFiles.indexHTML,
    },
    'api.ts': {
        isBinary: false,
        content: initialFiles.api,
    },
    '.env': {
        isBinary: false,
        content: initialFiles.env,
    },
    'global.d.ts': {
        isBinary: false,
        content: initialFiles.globalTypings,
    },
});
