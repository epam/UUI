import * as tsMorph from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { extractExportsFromTsProject } from '../../extractor';
import { formatExports } from '../../formatter';
import { ConverterContext } from '../../converterContext/converterContext';
import { TApiReferenceJson, TNotFormattedExportsByModule } from '../../types/types';
import { uuiRoot } from '../../../../constants';

const TEST_MAIN_FILE_PATH = path.join(uuiRoot, 'test/test.tsx');
const TEST_DEFAULT_MODULE_NAME = '@epam/test-module';
let testProject: tsMorph.Project;

function initTestProject() {
    if (testProject) {
        return testProject;
    }
    const p = path.resolve(uuiRoot, './tsconfig.json');
    const txt = fs.readFileSync(p, 'utf8').toString();
    const json = JSON.parse(txt);
    const { paths, baseUrl, outDir, ...co } = json.compilerOptions;
    const compilerOptions = {
        ...co,
        rootDir: uuiRoot,
        strictNullChecks: true,
        moduleResolution: tsMorph.ModuleResolutionKind.Node16,
        skipFileDependencyResolution: true,
    };
    testProject = new tsMorph.Project({
        compilerOptions,
        skipAddingFilesFromTsConfig: true,
        // Note: "useInMemoryFileSystem: true" isn't used here, because it doesn't resolve any "@types/*" from the node_modules.
    });
    return testProject;
}

export function generateDocs(fileContent: string): Pick<TApiReferenceJson, 'docsGenTypes'> {
    const project = initTestProject();
    const mainFilePath = TEST_MAIN_FILE_PATH;
    project.createSourceFile(mainFilePath, fileContent, { overwrite: true });
    const context = new ConverterContext();
    const exportsNotFormatted: TNotFormattedExportsByModule = {
        [TEST_DEFAULT_MODULE_NAME]: extractExportsFromTsProject({ project, mainFilePath, context }),
    };
    const { docsGenTypes } = formatExports(exportsNotFormatted, context);
    return { docsGenTypes };
}

expect.addSnapshotSerializer({
    test: (val: any) => {
        if (typeof val === 'object') {
            const keys = Object.keys(val);
            return keys.length === 1 && keys[0] === 'docsGenTypes';
        }
        return false;
    },
    print: (val: any) => JSON.stringify(val, undefined, 1),
});
