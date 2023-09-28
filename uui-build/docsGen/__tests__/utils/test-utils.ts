import * as tsMorph from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { extractExportsFromTsProject } from '../../extractor';
import { formatExports } from '../../formatter';
import { ConverterContext } from '../../converterContext/converterContext';
import { TNotFormattedExportsByModule } from '../../types/types';
import { TApiReferenceJson } from '../../types/docsGenSharedTypes';
import { uuiRoot } from '../../constants';

const TEST_MAIN_FILE_PATH = path.join(uuiRoot, 'test/test.tsx');
const TEST_DEFAULT_MODULE_NAME = '@epam/test-module';

function initTestProject() {
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
    return new tsMorph.Project({
        compilerOptions,
        skipAddingFilesFromTsConfig: true,
        useInMemoryFileSystem: true,
    });
}

export function generateDocs(fileContent: string): TApiReferenceJson {
    const project = initTestProject();
    const mainFilePath = TEST_MAIN_FILE_PATH;
    project.createSourceFile(mainFilePath, fileContent, { overwrite: true });
    const context = new ConverterContext();
    const exportsNotFormatted: TNotFormattedExportsByModule = {
        [TEST_DEFAULT_MODULE_NAME]: extractExportsFromTsProject({ project, mainFilePath, context }),
    };
    const publicTypes = formatExports(exportsNotFormatted, context);
    return {
        publicTypes,
        refs: context.refs.get(publicTypes),
    };
}
