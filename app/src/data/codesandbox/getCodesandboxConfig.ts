import type { CodesandboxFilesRecord } from './service';

export type FilesRecord = Record<string, { isBinary: boolean, content: string }>;

export const getCodesandboxConfig = (
    content: string,
    stylesheets: FilesRecord,
    initialFiles: CodesandboxFilesRecord['codesandboxFiles'],
    ) => ({
    ...stylesheets,
    'Example.tsx': {
        isBinary: false,
        content,
    },
    'index.tsx': {
        isBinary: false,
        content: initialFiles.indexTSX
    },
    'sandbox.config.json': {
        isBinary: false,
        content: initialFiles.sandboxConfigJSON,
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
    }
});