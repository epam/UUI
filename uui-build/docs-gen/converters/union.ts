import { Node } from 'ts-morph';
import { Converter } from './converter';
import { ConverterUtils } from './converterUtils';

export class Union extends Converter {
    override isSupported(typeNode: Node) {
        return ConverterUtils.getTypeFromNode(typeNode).isUnion();
    }

    protected override isPropsSupported() {
        return false;
    }

    protected override getTypeString(typeNode: Node) {
        const types = typeNode.getType().getUnionTypes();
        return types.map((t) => {
            return ConverterUtils.getCompilerTypeText(t);
        }).join(' | ');
    }
}
