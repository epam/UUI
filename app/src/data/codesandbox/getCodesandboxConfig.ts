export type FilesRecord = { [key: string]: { isBinary: boolean, content: string } };

export function getCodesandboxConfig(
    content: string,
    stylesheets: FilesRecord,
    initialFiles: Record<string, string>,
) {
    return {
        ...stylesheets,
        'Example.tsx': {
            isBinary: false,
            content,
        },
        'index.tsx': {
            isBinary: false,
            content: initialFiles.indexTSX
        },
        'services.ts': {
            isBinary: false,
            content: initialFiles.servicesTS
        },
        'package.json': {
            isBinary: false,
            content: initialFiles.packageJSON,
        },
        'tsconfig.json': {
            isBinary: false,
            content: initialFiles.tsConfigJSON,
        },
        "index.html": {
            isBinary: false,
            content: initialFiles.indexHTML
        }
    }
}