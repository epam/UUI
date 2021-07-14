export function getCodesandboxConfig(
    content: string,
    stylesheet: string,
    initialFiles: { [key: string]: string }
) {
    return {
        'Example.tsx': {
            isBinary: false,
            content,
        },
        ...(stylesheet && {
            'BasicExample.scss': {
                content: stylesheet,
                isBinary: false,
            },
        }),
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