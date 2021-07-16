import { join } from "path";
import { getParameters } from 'codesandbox/lib/api/define';
import { BasicExampleServices } from "../../services";
import { FilesRecord, getCodesandboxConfig } from "./getCodesandboxConfig";

const CodesandboxFiles: Record<string, string> = {
    'index.html': join('..', 'data', 'codesandbox', 'index.html'),
    'index.tsx': join('..', 'data', 'codesandbox', 'index.tsx'),
    'package.json': join('..', 'data', 'codesandbox', 'package.json'),
    'tsConfig.json': join('..', 'data', 'codesandbox', 'tsConfig.json'),
    'apiDefinitions.ts': join('..', 'data', 'apiDefinition.ts'),
};

export type CodesandboxFilesRecord = { codesandboxFiles: Record<string, string> };

export type CodesandboxContext = Partial<BasicExampleServices & {
    uuiApp: BasicExampleServices['uuiApp'] & CodesandboxFilesRecord
}>;

export class CodesandboxService {
    private context: CodesandboxContext;

    constructor(context: CodesandboxContext) {
        this.context = context;
    }

    public getFiles(): Promise<CodesandboxFilesRecord> {
        return Promise.all(Object.keys(CodesandboxFiles).map(name => {
            return this.context.api.getCode({ path: CodesandboxFiles[name] })
        })).then(data => data.map(file => file.raw)).then(
            ([ indexHTML, indexTSX, packageJSON, tsConfigJSON, api ]) => {
                Object.assign(this.context.uuiApp, {
                    codesandboxFiles: {
                        indexHTML,
                        indexTSX,
                        packageJSON,
                        tsConfigJSON,
                        api
                    }
                });

                return this.context.uuiApp;
            }
        );
    }

    public clearFiles(): Promise<CodesandboxFilesRecord> {
        Object.assign(this.context.uuiApp, { codesandboxFiles: {} });
        return Promise.resolve(this.context.uuiApp);
    }

    public getCodesandboxLink(code: string, stylesheets?: FilesRecord): string | null {
        if (
            this.context.uuiApp?.codesandboxFiles &&
            Object.values(this.context.uuiApp.codesandboxFiles).every(value => value)
        ) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');
            url.searchParams.set('parameters', getParameters({
                files: getCodesandboxConfig(code, stylesheets, this.context.uuiApp.codesandboxFiles)
            }));
            return url.toString();
        } else return null;
    }
}