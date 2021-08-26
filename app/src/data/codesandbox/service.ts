import { join } from "path";
import { getParameters } from 'codesandbox/lib/api/define';
import { BasicExampleServices } from "../../services";
import { FilesRecord, getCodesandboxConfig } from "./getCodesandboxConfig";

const CodesandboxFiles: Record<string, string> = {
    'index.html': join('..', 'data', 'codesandbox', 'index.html'),
    'index.tsx': join('..', 'data', 'codesandbox', 'index.tsx'),
    'package.json': join('..', 'data', 'codesandbox', 'package.json'),
    'tsconfig.json': join('..', 'data', 'codesandbox', 'tsconfig.json'),
    'apiDefinitions.ts': join('..', 'data', 'apiDefinition.ts'),
    '.env': join('..', 'data', 'codesandbox', '.env'),
};

export type CodesandboxFilesRecord = { codesandboxFiles: Record<string, string> };

export type CodesandboxContext = Partial<BasicExampleServices & {
    uuiApp: BasicExampleServices['uuiApp'] & CodesandboxFilesRecord
}>;

export class CodesandboxService {
    public getFiles(context: CodesandboxContext): Promise<void> {
        return Promise.all(Object.keys(CodesandboxFiles).map(name => {
            return context.api.getCode({ path: CodesandboxFiles[name] })
        })).then(data => data.map(file => file.raw)).then(
            ([ indexHTML, indexTSX, packageJSON, tsConfigJSON, api, env ]) => {
                Object.assign(context.uuiApp, {
                    codesandboxFiles: {
                        indexHTML,
                        indexTSX,
                        packageJSON,
                        tsConfigJSON,
                        api,
                        env
                    }
                });
            }
        );
    }

    public clearFiles(context: CodesandboxContext): void {
        Object.assign(context.uuiApp, { codesandboxFiles: {} });
    }

    public getCodesandboxLink(context: CodesandboxContext, code: string, stylesheets?: FilesRecord): string | null {
        if (
            context.uuiApp?.codesandboxFiles &&
            Object.values(context.uuiApp.codesandboxFiles).every(value => value)
        ) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');
            url.searchParams.set(
                'parameters',
                getParameters({
                    files: getCodesandboxConfig(
                        this.processCodeContent(code),
                        this.processStylesheets(stylesheets),
                        context.uuiApp.codesandboxFiles
                    ),
                })
            );
            url.searchParams.set('query', 'file=/Example.tsx')
            return url.toString();
        } else return null;
    }

    private processCodeContent(code: string): string {
        if (!code) return;
        const separator = '\r\n'
        const lines = code.split(separator);
        const iconFiles = lines.filter(line => line.endsWith(`.svg';`) || line.endsWith(`.svg";`));
        const stylesheetFiles = lines.filter(line => line.endsWith(`.scss';`));
        if (iconFiles.length > 0 || stylesheetFiles.length > 0) {
            return lines.map(line => {
                if (iconFiles.includes(line)) {
                    return line.replace(/import\s\*\sas\s(\w+)/, 'import { ReactComponent as $1 }');
                } else if (stylesheetFiles.includes(line)) {
                    return line.replace(/.scss/, '.module.scss');
                } else return line;
            }).join(separator);
        } else return code;
    }

    private processStylesheets(stylesheets: FilesRecord): FilesRecord {
        if (Object.keys(stylesheets).length === 0) return {};
        const processedStylesheets = {};
        for (const [path, stylesheet] of Object.entries(stylesheets)) {
            const [file, extension] = path.split('.');
            Object.assign(processedStylesheets, { [`${file}.module.${extension}`]: stylesheet });
        }
        return processedStylesheets;
    }
}