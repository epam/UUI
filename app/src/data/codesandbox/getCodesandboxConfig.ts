import type { CodesandboxFilesRecord, FilesRecord } from './types';

export const getCodesandboxConfig = (
    content: string,
    stylesheets: FilesRecord,
    initialFiles: CodesandboxFilesRecord,
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
    }
});