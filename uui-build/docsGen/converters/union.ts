import { Converter } from './converter';
import { TConvertable } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { TPropEditor, TTypeValue } from '../types/sharedTypes';
import { Type } from 'ts-morph';
import { PropEditorUtils } from './converterUtils/propEditorUtils';

export class Union extends Converter {
    override isSupported(nodeOrSymbol: TConvertable) {
        if (ConvertableUtils.isExternal(nodeOrSymbol)) {
            return false;
        }
        const type = ConvertableUtils.getType(nodeOrSymbol);
        return type.isUnion();
    }

    override convertPropEditor(params: { convertable: TConvertable }): TPropEditor | undefined {
        const { convertable } = params;
        const type = ConvertableUtils.getType(convertable);
        return PropEditorUtils.getPropEditorByUnionType(type);
    }

    public override convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue {
        const { convertable, isProperty } = params;
        const type = ConvertableUtils.getType(convertable);
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

        const node = ConvertableUtils.getNode(convertable);
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
