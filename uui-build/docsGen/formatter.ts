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
                    const convertable = SymbolUtils.getNodeFromSymbol(symbol);
                    if (convertable) {
                        context.convert({ convertable, exported: true });
                    }
                }
            });
        });
    });

    return context.getResults();
}
