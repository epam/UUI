import { Node, Project } from 'ts-morph';
import { IConverter, IConverterConstructor, IConverterContext, IDocGenStats } from '../types';
import { ConverterUtils } from './converterUtils';

export class ConverterContext implements IConverterContext {
    private allConverters: IConverter[] = [];
    private seenNodes: Set<Node> = new Set();

    constructor(
        public readonly project: Project,
        public readonly stats: IDocGenStats,
    ) {}

    public registerConverter(c: IConverterConstructor) {
        const converter = new c(this);
        this.allConverters.push(converter);
    }

    public convert(params: { typeNode: Node, isTypeProp: boolean }): ReturnType<IConverterContext['convert']> {
        const { typeNode, isTypeProp } = params;
        const instance = this.allConverters.find((c) => c.isSupported(typeNode));
        if (instance) {
            const isSeen = this.seenNodes.has(typeNode);
            const isExternal = ConverterUtils.isExternalNode(typeNode);
            if (isSeen || isExternal) {
                // avoid infinite loop for recursive types
                return {
                    typeValue: ConverterUtils.getTypeValueFromNode(typeNode, !isSeen),
                    typeRef: ConverterUtils.getTypeRef(typeNode),
                    kind: ConverterUtils.getSyntaxKindNameFromNode(typeNode),
                };
            } else if (isTypeProp) {
                return {
                    typeValue: instance.getTypeValue(typeNode, false),
                    typeRef: ConverterUtils.getTypeRef(typeNode),
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
