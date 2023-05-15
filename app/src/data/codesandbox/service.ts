// eslint-disable-next-line import/no-extraneous-dependencies
import { getParameters } from 'codesandbox/lib/api/define';
import { FilesRecord, getCodesandboxConfig } from './getCodesandboxConfig';
import { svc } from '../../services';

const CodesandboxFiles: Record<string, string> = {
    'index.html': '../data/codesandbox/index.html',
    'index.tsx': '../data/codesandbox/index.tsx',
    'package.json': '../data/codesandbox/package.json',
    'tsconfig.json': '../data/codesandbox/tsconfig.json',
    'apiDefinitions.ts': '../data/apiDefinition.ts',
    'globals.d.ts': '../data/codesandbox/globals.d.ts',
    '.env': '../data/codesandbox/.env',
};

export type CodesandboxFilesRecord = Record<string, string>;

class CodesandboxService {
    files: CodesandboxFilesRecord;
    constructor() {
        this.files = {};
    }

    public getFiles(): Promise<void> {
        return Promise.all(
            Object.keys(CodesandboxFiles).map((name) => {
                return svc.api.getCode({ path: CodesandboxFiles[name] });
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
        Object.assign(this.files, {});
    }

    public getCodesandboxParameters(code: string, stylesheets?: FilesRecord): string {
        return getParameters({
            files: getCodesandboxConfig(this.processCodeContent(code), stylesheets || {}, this.files),
        });
    }

    public getCodesandboxLink(): string | null {
        if (Object.values(this.files).every((value) => value)) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');

            url.searchParams.set('query', 'file=/Example.tsx');

            return url.toString();
        } else return null;
    }

    private processCodeContent(code: string): string {
        if (!code) return;
        const separator = '\n';
        const lines = code.split(separator);
        const iconFiles = lines.filter((line) => line.includes('.svg\';') || line.includes('.svg";'));
        const stylesheetFiles = lines.filter((line) => line.includes('.scss\';') || line.includes('.scss";'));
        if (iconFiles.length > 0 || stylesheetFiles.length > 0) {
            return lines
                .map((line) => {
                    if (iconFiles.includes(line)) {
                        return line.replace(/import\s\*\sas\s(\w+)/, 'import { ReactComponent as $1 }');
                    } else {
                        return line;
                    }
                })
                .join(separator);
        } else return code;
    }
}

export const codesandboxService = new CodesandboxService();
