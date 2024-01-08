import { ExportedDeclarations, Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { IConverterContext, TExportedDeclarations, TNotFormattedExportsByModule } from './types/types';
import {
    INCLUDED_EXPORT_KINDS,
    INCLUDED_PACKAGES,
    INDEX_PATH,
    SYNTAX_KIND_NAMES,
    TSCONFIG_PATH,
} from './constants';
import { resolveModuleName } from './utils/fileUtils';
import { uuiRoot } from '../../constants';

export function extractExports(context: IConverterContext) {
    return Object.keys(INCLUDED_PACKAGES).reduce<TNotFormattedExportsByModule>((acc, packageName) => {
        const moduleDirRel = INCLUDED_PACKAGES[packageName];
        const moduleDirAbs = path.resolve(uuiRoot, moduleDirRel);
        const {
            project,
        } = initProject(moduleDirAbs);
        const mainFilePath = path.resolve(moduleDirAbs, INDEX_PATH);
        acc[packageName] = extractExportsFromTsProject({ project, mainFilePath, context });
        return acc;
    }, {});
}

export function extractExportsFromTsProject(params: { project: Project, mainFilePath: string, context: IConverterContext }) {
    const {
        project,
        mainFilePath,
        context,
    } = params;
    const mainFile = project.getSourceFileOrThrow(mainFilePath);
    const ed = [...mainFile.getExportedDeclarations().entries()].sort((ed1, ed2) => {
        // compare by names
        return ed1[0].localeCompare(ed2[0]);
    });
    return ed.reduce<TExportedDeclarations>((accEd, [name, entry]) => {
        const kind = getExportKind(entry);
        const isAllowed = filterExportDeclaration(kind, name);
        const module = resolveModuleName(mainFilePath);
        const kindStr = kindToString(kind);

        if (isAllowed) {
            accEd[name] = {
                entry,
                kind: getExportKind(entry),
            };
            context.stats.addIncludedExport({ module, kind: kindStr, name });
        } else {
            context.stats.addIgnoredExport({ module, kind: kindStr, name });
        }
        return accEd;
    }, {});
}

function initProject(tsProjectRootDir: string) {
    const tsConfigFilePath = path.resolve(tsProjectRootDir, TSCONFIG_PATH);
    const project = new Project({ tsConfigFilePath, compilerOptions: { strictNullChecks: true } });
    return {
        project,
    };
}

function getExportKind(entry: ExportedDeclarations[]) {
    return entry[0].getKind();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function filterExportDeclaration(kind: SyntaxKind, name: string) {
    return INCLUDED_EXPORT_KINDS.indexOf(kind) !== -1;
}

function kindToString(kind: SyntaxKind): string {
    return SYNTAX_KIND_NAMES[kind];
}
