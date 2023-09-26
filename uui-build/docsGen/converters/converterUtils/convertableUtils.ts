import { TConvertable } from '../../types';
import { Node, Type, TypeChecker } from 'ts-morph';
import { NodeUtils } from './nodeUtils';
import { SymbolUtils } from './symbolUtils';

export class ConvertableUtils {
    static getType(nodeOrSymbol: TConvertable, typeChecker: TypeChecker): Type {
        if (Node.isNode(nodeOrSymbol)) {
            return NodeUtils.getTypeFromNode(nodeOrSymbol);
        } else {
            return SymbolUtils.getTypeFromSymbol(nodeOrSymbol, typeChecker);
        }
    }

    static getNode(nodeOrSymbol: TConvertable): Node {
        if (Node.isNode(nodeOrSymbol)) {
            return nodeOrSymbol;
        } else {
            return SymbolUtils.getNodeFromSymbol(nodeOrSymbol);
        }
    }
}
