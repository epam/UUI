import { Converter } from './converter';
import { TConvertable } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { TTypeValue } from '../types/sharedTypes';

export class Union extends Converter {
    override isSupported(nodeOrSymbol: TConvertable) {
        return ConvertableUtils.getType(nodeOrSymbol).isUnion();
    }

    public override convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue {
        const type = ConvertableUtils.getType(nodeOrSymbol);
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const types = type.getUnionTypes();

        return {
            raw: types.map((t) => {
                return TypeUtils.getCompilerTypeText(t);
            }).join(' | '),
            print: print ? NodeUtils.printNode(node) : undefined,
        };
    }
}
