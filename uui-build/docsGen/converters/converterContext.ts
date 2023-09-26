import { Project } from 'ts-morph';
import { IConverter, IConverterConstructor, IConverterContext, IDocGenStats, TConvertable } from '../types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';

export class ConverterContext implements IConverterContext {
    private allConverters: IConverter[] = [];
    private seenNodes: Set<TConvertable> = new Set();

    constructor(
        public readonly project: Project,
        public readonly stats: IDocGenStats,
    ) {}

    public registerConverter(c: IConverterConstructor) {
        const converter = new c(this);
        this.allConverters.push(converter);
    }

    public convert(params: { nodeOrSymbol: TConvertable, isTypeProp: boolean }): ReturnType<IConverterContext['convert']> {
        const { nodeOrSymbol, isTypeProp } = params;
        const instance = this.allConverters.find((c) => c.isSupported(nodeOrSymbol));
        if (instance) {
            const isSeen = this.seenNodes.has(nodeOrSymbol);
            const node = ConvertableUtils.getNode(nodeOrSymbol);
            const isExternal = NodeUtils.isExternalNode(node);
            if (isSeen || isExternal) {
                // avoid infinite loop for recursive types
                return {
                    typeValue: NodeUtils.getTypeValueFromNode(node, !isSeen),
                    typeRef: NodeUtils.getTypeRef(node),
                    kind: NodeUtils.getSyntaxKindNameFromNode(node),
                };
            } else if (isTypeProp) {
                return {
                    typeValue: instance.convertToTypeValue(nodeOrSymbol, false),
                    typeRef: NodeUtils.getTypeRef(node),
                    kind: NodeUtils.getSyntaxKindNameFromNode(node),
                };
            }
            this.seenNodes.add(nodeOrSymbol);
            const result = instance.convert(nodeOrSymbol);
            this.seenNodes.delete(nodeOrSymbol);
            return result;
        }
        console.error(`Unable to find a converter for nodeOrSymbol=${nodeOrSymbol}`);
    }
}
