import { Node } from 'ts-morph';
import { Converter } from './converter';
import { ConverterUtils } from './converterUtils';
import { TTypeValue } from '../types';

export class Union extends Converter {
    override isSupported(typeNode: Node) {
        return ConverterUtils.getTypeFromNode(typeNode).isUnion();
    }

    protected override isPropsSupported(typeNode: Node) {
        if (ConverterUtils.isExternalNode(typeNode)) {
            return false;
        }
        const types = typeNode.getType().getUnionTypes();
        const allNonLiterals = types.every((t) => {
            return !t.isLiteral();
        });
        return allNonLiterals;
    }

    protected override getTypeValue(typeNode: Node): TTypeValue {
        const types = typeNode.getType().getUnionTypes();
        return {
            raw: types.map((t) => {
                return ConverterUtils.getCompilerTypeText(t);
            }).join(' | '),
            print: ConverterUtils.printNode(typeNode),
        };
    }
}
