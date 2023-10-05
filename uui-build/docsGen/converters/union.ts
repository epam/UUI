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
        const rawTypesArr = types.reduce((acc, t) => {
            const text = TypeUtils.getCompilerTypeText(t);
            const lastInAcc = acc[acc.length - 1];
            const isSubsequentBool = (text === 'true' && lastInAcc === 'false') || (text === 'false' && lastInAcc === 'true');
            if (isSubsequentBool) {
                acc[acc.length - 1] = 'boolean';
                return acc;
            } else if (text === 'undefined') {
                return acc;
            }
            acc.push(text);
            return acc;
        }, []);

        return {
            raw: rawTypesArr.join(' | '),
            print: print ? NodeUtils.printNode(node) : undefined,
        };
    }
}
