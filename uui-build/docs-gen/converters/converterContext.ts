import { Node, TypeChecker } from 'ts-morph';
import { IConverter, IConverterConstructor, IConverterContext } from '../types';
import { ConverterUtils } from './converterUtils';

export class ConverterContext implements IConverterContext {
    private allConverters: IConverter[] = [];
    private seenNodes: Set<Node> = new Set();

    constructor(
        public readonly typeChecker: TypeChecker,
    ) {}

    public registerConverter(c: IConverterConstructor) {
        const converter = new c(this);
        this.allConverters.push(converter);
    }

    public convert(typeNode: Node): ReturnType<IConverterContext['convert']> {
        const instance = this.allConverters.find((c) => c.isSupported(typeNode));
        if (instance) {
            if (this.seenNodes.has(typeNode) || ConverterUtils.isExternalNode(typeNode)) {
                // avoid infinite loop for recursive types
                return {
                    value: ConverterUtils.getTypeTextFromNode(typeNode),
                    valuePrint: [],
                    name: ConverterUtils.getTypeName(typeNode.getSymbol()),
                    kind: ConverterUtils.getSyntaxKindNameFromNode(typeNode),
                };
            }
            this.seenNodes.add(typeNode);
            const result = instance.convert(typeNode);
            this.seenNodes.delete(typeNode);
            return result;
        }
        console.error(`Unable to find a converter for typeNode=${typeNode}`);
    }
}
