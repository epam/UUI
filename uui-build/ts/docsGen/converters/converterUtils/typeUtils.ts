import { Symbol, Node, Type } from 'ts-morph';
// eslint-disable-next-line import/no-cycle
import { SymbolUtils } from './symbolUtils';

export class TypeUtils {
    static getCompilerTypeText(type: Type): string {
        return type.getText().replace(/import\("[^()"]+"\)\./g, '').replace(/"/g, "'");
    }

    // TODO: review kinds, add tests
    static isPropsSupportedByType(params: { type: Type, isExternalType: boolean }): boolean {
        const { type, isExternalType } = params;
        if (isExternalType) {
            return false;
        }
        if (!type) {
            return false;
        }
        const unionTypes = type.getUnionTypes();
        if (unionTypes.length) {
            const allSupportProps = unionTypes.every((t) => {
                const all = [
                    t.isLiteral(),
                    t.isUndefined(),
                    t.isNull(),
                    t.isNever(),
                    t.isAny(),
                    t.isUnknown(),
                    t.isVoid(),
                    t.isTypeParameter(),
                    t.isTuple(),
                ];
                return all.indexOf(true) === -1;
            });
            if (allSupportProps) {
                return true;
            }
        }
        if (type.isTuple()) {
            return false;
        }
        return type.isClassOrInterface() || type.isIntersection() || type.isObject();
    }

    static getSymbolFromType(type: Type) {
        return type.getSymbol() || type.getAliasSymbol();
    }

    /**
     * Sometimes it's just not possible to get Node from type, it will return undefined in such case.
     * @param type
     */
    static getNodeFromType(type: Type): Node | undefined {
        const symbol = TypeUtils.getSymbolFromType(type);
        if (symbol) {
            return SymbolUtils.getNodeFromSymbol(symbol);
        }
    }

    static getIndexSignature(type: Type): Symbol[] {
        const symbol = TypeUtils.getSymbolFromType(type);
        if (symbol) {
            const node = SymbolUtils.getNodeFromSymbol(symbol);
            if (Node.isTypeElementMembered(node)) {
                return node.getIndexSignatures().reduce<Symbol[]>((acc, element) => {
                    const s = element.getSymbol();
                    if (s) {
                        acc.push(s);
                    }
                    return acc;
                }, []);
            }
        }
        return [];
    }
}
