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
            const declList = decl.getSymbol()?.getDeclarations();
            const typeNode = declList?.[0];
            if (typeNode) {
                const res = convertType(typeNode, project);
                const tn = res?.typeRef.typeName.name;
                if (tn) {
                    result[tn] = {
                        ...res,
                    };
                }
            }
        });
    });

    return Object.keys(result).sort((e1, e2) => e1.localeCompare(e2)).reduce<TUuiModuleFormattedExport>((acc, eName) => {
        acc[eName] = result[eName];
        return acc;
    }, {});
}
