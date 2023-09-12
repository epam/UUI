import { ExportedDeclarations, Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { TExportedDeclarations, TUuiModulesExports } from './types';
import { INCLUDED_UUI_PACKAGES, INDEX_PATH, TSCONFIG_PATH } from './constants';

export function extractExports() {
    return Object.keys(INCLUDED_UUI_PACKAGES).reduce<TUuiModulesExports>((acc, packageName) => {
        const moduleRootDir = INCLUDED_UUI_PACKAGES[packageName];
        const {
            project,
            typeChecker,
        } = initProject(moduleRootDir);
        const mainFilePath = path.resolve(moduleRootDir, INDEX_PATH);
        const exportedDeclarations = extractExportsFromTsProject({ project, mainFilePath });
        acc[packageName] = {
            project,
            typeChecker,
            exportedDeclarations,
        };
        return acc;
    }, {});
}

function initProject(tsProjectRootDir: string) {
    const tsConfigFilePath = path.resolve(tsProjectRootDir, TSCONFIG_PATH);
    const project = new Project({ tsConfigFilePath, compilerOptions: { strictNullChecks: true } });
    const typeChecker = project.getTypeChecker();
    return {
        project,
        typeChecker,
    };
}

export function extractExportsFromTsProject(params: { project: Project, mainFilePath: string }) {
    const {
        project,
        mainFilePath,
    } = params;
    const mainFile = project.getSourceFileOrThrow(mainFilePath);
    const ed = mainFile.getExportedDeclarations();
    return [...ed.entries()].reduce<TExportedDeclarations>((accEd, [name, entry]) => {
        const isAllowed = filterExportDeclaration(name, entry);
        if (isAllowed) {
            accEd[name] = {
                entry,
                kind: getExportKind(entry),
            };
        }
        return accEd;
    }, {});
}

function getExportKind(entry: ExportedDeclarations[]) {
    return entry[0].getKind();
}
function filterExportDeclaration(name: string, entry: ExportedDeclarations[]) {
    const EXPORTED_KIND = [
        SyntaxKind.TypeAliasDeclaration,
        SyntaxKind.InterfaceDeclaration,
        SyntaxKind.EnumDeclaration,
    ];
    return EXPORTED_KIND.indexOf(getExportKind(entry)) !== -1;
}
