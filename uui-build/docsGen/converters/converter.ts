import { Node } from 'ts-morph';
import { IConverter, IConverterContext, TConvertable, TTypeConverted } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { TTypeDetails, TTypeValue } from '../types/sharedTypes';
import { getTypeRefFromTypeSummary } from './converterUtils/converterUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue {
        if (Node.isNode(nodeOrSymbol)) {
            const node = ConvertableUtils.getNode(nodeOrSymbol);
            return NodeUtils.getTypeValueFromNode(node, print);
        }
        return SymbolUtils.getTypeValueFromNode(nodeOrSymbol, print);
    }

    isSupported(nodeOrSymbol: TConvertable) {
        return !!nodeOrSymbol;
    }

    convert(nodeOrSymbol: TConvertable): TTypeConverted {
        const summary = this.context.convertTypeSummary(nodeOrSymbol);
        const typeValue = this.convertToTypeValue(nodeOrSymbol, true);
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const kind = node.getKind();
        const typeRef = getTypeRefFromTypeSummary(summary);
        const propsConverted = this.context.convertTypeProps(nodeOrSymbol);
        const details: TTypeDetails = {
            kind,
            typeValue,
            ...propsConverted,
        };
        return {
            typeRef,
            summary,
            details,
        };
    }
}
