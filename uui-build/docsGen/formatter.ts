import {
    IConverterContext, TApiReferenceJson,
    TNotFormattedExportsByModule,
} from './types/types';
import { SymbolUtils } from './converters/converterUtils/symbolUtils';

export function formatExports(exports: TNotFormattedExportsByModule, context: IConverterContext): TApiReferenceJson {
    Object.keys(exports).forEach((moduleName) => {
        const singleDecl = exports[moduleName];
        Object.keys(singleDecl).forEach((declName) => {
            const { entry } = singleDecl[declName];
            entry.forEach((decl) => {
                const symbol = decl.getSymbol();
                if (symbol) {
                    const typeNode = SymbolUtils.getNodeFromSymbol(symbol);
                    if (typeNode) {
                        context.convert(typeNode, true);
                    }
                }
            });
        });
    });

    return context.getResults();
}
