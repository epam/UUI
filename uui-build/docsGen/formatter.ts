import {
    IConverterContext, parseTypeRefShort,
    TNotFormattedExportsByModule,
} from './types/types';
import { SymbolUtils } from './converters/converterUtils/symbolUtils';
import { TApiReferenceJson, TPublicTypesByModule, TType } from './types/docsGenSharedTypes';

export function formatExports(exports: TNotFormattedExportsByModule, context: IConverterContext): TPublicTypesByModule {
    const exportsByModule = new DocGenExportsByModule();
    Object.keys(exports).forEach((moduleName) => {
        const singleDecl = exports[moduleName];
        Object.keys(singleDecl).forEach((declName) => {
            const { entry } = singleDecl[declName];
            entry.forEach((decl) => {
                const symbol = decl.getSymbol();
                if (symbol) {
                    const typeNode = SymbolUtils.getNodeFromSymbol(symbol);
                    if (typeNode) {
                        const res = context.convert(typeNode);
                        exportsByModule.add(moduleName, res);
                    }
                }
            });
        });
    });

    return exportsByModule.get();
}

class DocGenExportsByModule {
    private data: TPublicTypesByModule = {};

    add(moduleName: string, type: TType) {
        const bucket = this.data[moduleName] || {};
        this.data[moduleName] = bucket;
        const { typeName } = parseTypeRefShort(type.typeRef);
        bucket[typeName] = type;
    }

    get(): TApiReferenceJson['publicTypes'] {
        return this.data;
    }
}
