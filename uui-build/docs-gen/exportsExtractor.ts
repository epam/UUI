import { ExportedDeclarations, Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { TExportedDeclarations, TUuiModulesExports } from './types';
import { INCLUDED_EXPORT_KINDS, INCLUDED_UUI_PACKAGES, INDEX_PATH, TSCONFIG_PATH } from './constants';
import { DocGenStats } from './stats';

const stats = new DocGenStats();

export function extractExports() {
    const result = Object.keys(INCLUDED_UUI_PACKAGES).reduce<TUuiModulesExports>((acc, packageName) => {
        const moduleRootDir = INCLUDED_UUI_PACKAGES[packageName];
        const {
            project,
        } = initProject(moduleRootDir);
        const mainFilePath = path.resolve(moduleRootDir, INDEX_PATH);
        const exportedDeclarations = extractExportsFromTsProject({ project, mainFilePath });
        acc[packageName] = {
            project,
            exportedDeclarations,
        };
        return acc;
    }, {});
    stats.printIgnored();
    return result;
}

function initProject(tsProjectRootDir: string) {
    const tsConfigFilePath = path.resolve(tsProjectRootDir, TSCONFIG_PATH);
    const project = new Project({ tsConfigFilePath, compilerOptions: { strictNullChecks: true } });
    return {
        project,
    };
}

export function extractExportsFromTsProject(params: { project: Project, mainFilePath: string }) {
    const {
        project,
        mainFilePath,
    } = params;
    const mainFile = project.getSourceFileOrThrow(mainFilePath);
    const ed = [...mainFile.getExportedDeclarations().entries()].sort((ed1, ed2) => {
        // compare by names
        return ed1[0].localeCompare(ed2[0]);
    });
    return ed.reduce<TExportedDeclarations>((accEd, [name, entry]) => {
        const kind = getExportKind(entry);
        const isAllowed = filterExportDeclaration(kind, name);
        if (isAllowed) {
            accEd[name] = {
                entry,
                kind: getExportKind(entry),
            };
        } else {
            stats.addIgnored(kind, name);
        }
        return accEd;
    }, {});
}

function getExportKind(entry: ExportedDeclarations[]) {
    return entry[0].getKind();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function filterExportDeclaration(kind: SyntaxKind, name: string) {
    return INCLUDED_EXPORT_KINDS.indexOf(kind) !== -1;
}