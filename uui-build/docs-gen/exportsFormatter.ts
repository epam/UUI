import { TUuiModuleFormattedExport, TUuiModulesExports } from './types';
import { convertType } from './converters/convertType';

export function formatExports(exports: TUuiModulesExports): Record<string, TUuiModuleFormattedExport> {
    return Object.keys(exports).reduce((acc, moduleName) => {
        acc[moduleName] = formatModuleLevelDeclarations(exports[moduleName]);
        return acc;
    }, {} as Record<string, TUuiModuleFormattedExport>);
}

function formatModuleLevelDeclarations(exports: TUuiModulesExports[keyof TUuiModulesExports]): TUuiModuleFormattedExport {
    const { exportedDeclarations, typeChecker } = exports;
    const result: TUuiModuleFormattedExport = {};
    Object.keys(exportedDeclarations).forEach((name) => {
        const { entry } = exportedDeclarations[name];
        entry.forEach((decl) => {
            const declList = decl.getSymbol().getDeclarations();
            const res = convertType(declList[0], typeChecker);
            result[res.name] = {
                ...res,
            };
        });
    });
    return result;
}
