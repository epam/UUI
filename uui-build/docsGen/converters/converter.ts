import { Node } from 'ts-morph';
import { IConverter, IConverterContext, TConvertable, TTypeConverted } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { TTypeDetails, TTypeValue } from '../types/sharedTypes';
import { getTypeRefFromTypeSummary } from './converterUtils/converterUtils';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue {
        const { convertable, isProperty } = params;
        const print = !isProperty;
        if (Node.isNode(convertable)) {
            const node = ConvertableUtils.getNode(convertable);
            return NodeUtils.getTypeValueFromNode(node, print);
        }
        return SymbolUtils.getTypeValueFromNode(convertable, print);
    }

    isSupported(nodeOrSymbol: TConvertable) {
        return !!nodeOrSymbol;
    }

    convert(params: { convertable: TConvertable, isProperty: boolean }): TTypeConverted {
        const { convertable, isProperty } = params;
        const summary = this.context.convertTypeSummary({ convertable });
        const typeValue = this.convertToTypeValue({ convertable, isProperty });
        const node = ConvertableUtils.getNode(convertable);
        const kind = node.getKind();
        const typeRef = getTypeRefFromTypeSummary(summary);
        const propsConverted = this.context.convertTypeProps({ convertable });
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
