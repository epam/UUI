import { CodesandboxFilesRecord, CodesandboxService } from './service';

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