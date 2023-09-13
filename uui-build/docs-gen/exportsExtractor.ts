import { ExportedDeclarations, Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { TExportedDeclarations, TUuiModulesExports } from './types';
import { INCLUDED_UUI_PACKAGES, INDEX_PATH, TSCONFIG_PATH } from './constants';
import { mapSyntaxKind } from '../build/docs-gen/utils';

class DocGenStatsBucket {
    private data: Record<string, Set<string>> = {};
    add(kind: SyntaxKind, value: string) {
        const kindStr = mapSyntaxKind(kind);
        if (typeof this.data[kindStr] === 'undefined') {
            this.data[kindStr] = new Set();
        }
        this.data[kindStr].add(value);
    }

    toString() {
        const r = Object.keys(this.data).reduce<Record<string, string[]>>((acc, kind) => {
            acc[kind] = [...this.data[kind]];
            return acc;
        }, {});
        return JSON.stringify(r, undefined, 1);
    }
}

class DocGenStats {
    private ignoredExports = new DocGenStatsBucket();
    private collectedExports = new DocGenStatsBucket();

    addIgnored(kind: SyntaxKind, name: string) {
        this.ignoredExports.add(kind, name);
    }

    addCollected(kind: SyntaxKind, name: string) {
        this.collectedExports.add(kind, name);
    }

    printIgnored() {
        // eslint-disable-next-line no-console
        console.log(`Ignored.\n${this.ignoredExports.toString()}`);
    }
}
const stats = new DocGenStats();

export function extractExports() {
    const result = Object.keys(INCLUDED_UUI_PACKAGES).reduce<TUuiModulesExports>((acc, packageName) => {
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
    stats.printIgnored();
    return result;
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
    const EXPORTED_KIND = [
        SyntaxKind.TypeAliasDeclaration,
        SyntaxKind.InterfaceDeclaration,
        SyntaxKind.EnumDeclaration,
    ];
    return EXPORTED_KIND.indexOf(kind) !== -1;
}
