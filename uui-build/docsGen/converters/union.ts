import { Converter } from './converter';
import { TConvertable } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { TTypeValue } from '../types/sharedTypes';
import { Type } from 'ts-morph';

export class Union extends Converter {
    override isSupported(nodeOrSymbol: TConvertable) {
        return ConvertableUtils.getType(nodeOrSymbol).isUnion();
    }

    public override convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue {
        const { convertable, isProperty } = params;
        const type = ConvertableUtils.getType(convertable);
        const node = ConvertableUtils.getNode(convertable);
        const types = type.getUnionTypes();
        const rawTypesArr = types.reduce<(Type | string)[]>((acc, t) => {
            const prev = acc[acc.length - 1];
            if (prev && typeof prev !== 'string') {
                if (prev.isBooleanLiteral() && t.isBooleanLiteral() && prev.getText() !== t.getText()) {
                    acc[acc.length - 1] = 'boolean';
                    return acc;
                }
            }
            if (isProperty && t.isUndefined()) {
                return acc;
            }
            acc.push(t);
            return acc;
        }, []);

        return {
            raw: rawTypesArr.map((t) => {
                if (typeof t === 'string') {
                    return t;
                }
                return TypeUtils.getCompilerTypeText(t);
            }).join(' | '),
            print: isProperty ? undefined : NodeUtils.printNode(node),
        };
    }
}
