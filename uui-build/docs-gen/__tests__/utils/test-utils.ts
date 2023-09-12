import * as tsMorph from 'ts-morph';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import { uuiRoot } from '../../../utils/constants';
// @ts-ignore
import { extractExportsFromTsProject } from '../../exportsExtractor';
// @ts-ignore
import { formatExports } from '../../exportsFormatter';

const TEST_MAIN_FILE_PATH = 'test/test.tsx';
const TEST_DEFAULT_MODULE_NAME = '@epam/test-module';

function initTestProject() {
    const p = path.resolve(uuiRoot, './tsconfig.json');
    const txt = fs.readFileSync(p, 'utf8').toString();
    const json = JSON.parse(txt);
    const { paths, baseUrl, outDir, ...co } = json.compilerOptions;
    const compilerOptions = {
        ...co,
        strictNullChecks: true,
        moduleResolution: tsMorph.ModuleResolutionKind.Node16,
        skipFileDependencyResolution: true,
    };
    return new tsMorph.Project({
        compilerOptions,
        skipAddingFilesFromTsConfig: true,
        useInMemoryFileSystem: true,
    });
}

export function generateDocs(fileContent: string) {
    const project = initTestProject();
    const mainFilePath = TEST_MAIN_FILE_PATH;
    project.createSourceFile(mainFilePath, fileContent, { overwrite: true });
    const exportedDeclarations = extractExportsFromTsProject({ project, mainFilePath });
    return formatExports({
        [TEST_DEFAULT_MODULE_NAME]: {
            project,
            typeChecker: project.getTypeChecker(),
            exportedDeclarations,
        },
    });
}
