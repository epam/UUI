import { Node, Symbol, Type, TypeChecker } from 'ts-morph';
import { TTypeName, TTypeValue } from '../../types';
// eslint-disable-next-line import/no-cycle
import { TypeUtils } from './typeUtils';
import { NodeUtils } from './nodeUtils';

export class SymbolUtils {
    static getTypeName(typeSymbol?: Symbol): TTypeName {
        const result: TTypeName = { name: '', nameFull: '' };
        if (typeSymbol) {
            result.name = typeSymbol.getEscapedName();
            const declared = typeSymbol.getDeclaredType();
            const ta = declared.getTypeArguments();
            const ata = declared.getAliasTypeArguments();
            const argsArr = ta.length > 0 ? ta : ata;
            if (argsArr.length > 0) {
                const params = argsArr.map((a) => {
                    const s = a.getSymbol();
                    if (s) {
                        return s.getEscapedName();
                        /* const sd = s.getDeclarations()[0];
                        const name = s.getEscapedName();
                        if (Node.isTypeParameterDeclaration(sd)) {
                            const dv = sd.getDefault();
                            return `${name} = ${dv.getText()}`
                        }
                        return name; */
                    }
                    return TypeUtils.getCompilerTypeText(a); // need to check that the output isn't too big in such case
                }).join(', ');
                result.nameFull = `${result.name}<${params}>`;
            } else {
                result.nameFull = result.name;
            }
        }
        return result;
    }

    /**
     * It's possible to get node from symbol, but it's not possible to get the same symbol back from this node.
     * So, if symbol-specific info is needed, then it's better not to convert it to node.
     * @param symbol
     */
    static getNodeFromSymbol(symbol: Symbol): Node {
        if (symbol) {
            const decls = symbol.getDeclarations();
            return decls[0];
        }
    }

    static getTypeFromSymbol(symbol: Symbol, typeChecker: TypeChecker): Type {
        const node = SymbolUtils.getNodeFromSymbol(symbol);
        return typeChecker.getTypeOfSymbolAtLocation(symbol, node);
    }

    static getTypeValueFromNode(symbol: Symbol, print?: boolean): TTypeValue {
        const node = SymbolUtils.getNodeFromSymbol(symbol);
        const type = symbol.getTypeAtLocation(node);

        const result: TTypeValue = {
            raw: TypeUtils.getCompilerTypeText(type),
        };
        if (print) {
            result.print = NodeUtils.printNode(node);
        }
        return result;
    }
}
