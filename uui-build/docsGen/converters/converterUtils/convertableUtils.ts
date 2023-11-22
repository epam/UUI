import { TConvertable } from '../../types/types';
import { Node, Type } from 'ts-morph';
import { NodeUtils } from './nodeUtils';
import { SymbolUtils } from './symbolUtils';

export class ConvertableUtils {
    static getType(nodeOrSymbol: TConvertable): Type {
        if (Node.isNode(nodeOrSymbol)) {
            return NodeUtils.getTypeFromNode(nodeOrSymbol);
        } else {
            return SymbolUtils.getTypeFromSymbol(nodeOrSymbol);
        }
    }

    static getNode(nodeOrSymbol: TConvertable): Node {
        if (Node.isNode(nodeOrSymbol)) {
            return nodeOrSymbol;
        } else {
            return SymbolUtils.getNodeFromSymbol(nodeOrSymbol);
        }
    }

    static isExternal(nodeOrSymbol: TConvertable): boolean {
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        return NodeUtils.isExternalNode(node);
    }
}
