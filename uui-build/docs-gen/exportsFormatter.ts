import { TUuiModuleFormattedExport, TUuiModulesExports } from './types';
import { convertType } from './converters/convertType';

export function formatExports(exports: TUuiModulesExports): Record<string, TUuiModuleFormattedExport> {
    return Object.keys(exports).reduce<Record<string, TUuiModuleFormattedExport>>((acc, moduleName) => {
        acc[moduleName] = formatModuleLevelDeclarations(exports[moduleName]);
        return acc;
    }, {});
}

function formatModuleLevelDeclarations(exports: TUuiModulesExports[keyof TUuiModulesExports]): TUuiModuleFormattedExport {
    const { exportedDeclarations, project } = exports;
    const result: TUuiModuleFormattedExport = {};
    Object.keys(exportedDeclarations).forEach((name) => {
        const { entry } = exportedDeclarations[name];
        entry.forEach((decl) => {
            const declList = decl.getSymbol().getDeclarations();
            const res = convertType(declList[0], project);
            result[res.typeName.name] = {
                ...res,
            };
        });
    });
    return result;
}