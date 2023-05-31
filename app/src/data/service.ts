import { getParameters } from 'codesandbox/lib/api/define';
import { CodesandboxFilesRecord, FilesRecord, getCodesandboxConfig } from './codesandbox/getCodesandboxConfig';
import { svc } from '../services';

const CodesandboxFiles: Record<string, string | { path: string, placeholders: Record<string, string> }> = {
    'index.html': '../data/codesandbox/index.html',
    'index.tsx': '../data/codesandbox/index.tsx',
    'package.json': {
        path: '../data/codesandbox/package.json',
        placeholders: {
            '<UUI_VERSION>': __PACKAGE_VERSION__, // __PACKAGE_VERSION__ will be replaced to a real string by Webpack
        },
    },
    'tsconfig.json': '../data/codesandbox/tsconfig.json',
    'apiDefinitions.ts': '../data/apiDefinition.ts',
    'globals.d.ts': '../data/codesandbox/globals.d.ts',
    '.env': '../data/codesandbox/.env',
};

class CodesandboxService {
    files: CodesandboxFilesRecord;
    constructor() {
        this.files = {};
    }

    public getFiles(): Promise<void> {
        if (!svc.api) {
            throw new Error('svc.api isn\'t available');
        }
        const svcApi = svc.api;

        return Promise.all(
            Object.keys(CodesandboxFiles).map((name) => {
                const params = CodesandboxFiles[name];
                let path: string;
                let placeholders: Record<string, string>;
                if (typeof params === 'string') {
                    path = params;
                } else {
                    path = params.path;
                    placeholders = params.placeholders;
                }

                return svcApi.getCode({ path }).then((file) => {
                    if (placeholders) {
                        file.raw = Object.keys(placeholders).reduce((acc, phName) => {
                            return file.raw.replace(new RegExp(phName, 'g'), placeholders[phName]);
                        }, file.raw);
                    }
                    return file;
                });
            }),
        )
            .then((data) => data.map((file) => file.raw))
            .then(([
                indexHTML, indexTSX, packageJSON, tsConfigJSON, api, globalTypings, env,
            ]) => {
                Object.assign(this.files, {
                    indexHTML,
                    indexTSX,
                    packageJSON,
                    tsConfigJSON,
                    api,
                    globalTypings,
                    env,
                });
            });
    }

    public clearFiles(): void {
        this.files = {};
    }

    public getCodesandboxParameters(code: string, stylesheets?: FilesRecord): string {
        return getParameters({
            files: getCodesandboxConfig(code, stylesheets || {}, this.files),
        });
    }

    public getCodesandboxLink(): string | null {
        if (Object.values(this.files).every((value) => value)) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');

            url.searchParams.set('query', 'file=/Example.tsx');

            return url.toString();
        } else return null;
    }
}

export const codesandboxService = new CodesandboxService();
