import { IConverter, IConverterContext, IDocGenReferences, TConvertable } from '../types/types';
import { NodeUtils } from '../converters/converterUtils/nodeUtils';
import { ConvertableUtils } from '../converters/converterUtils/convertableUtils';
import { Union } from '../converters/union';
import { Converter } from '../converters/converter';
import { DocGenReferences } from './docGenReferences';
import { DocGenStats } from './docGenStats';
import { TType, TTypeValue } from '../types/docsGenSharedTypes';

export class ConverterContext implements IConverterContext {
    private allConverters: IConverter[] = [];
    private seenNodes: Set<TConvertable> = new Set();
    public refs: IDocGenReferences = new DocGenReferences();
    public stats: DocGenStats;

    constructor() {
        this.allConverters.push(...[
            new Union(this),
            new Converter(this), // fallback - always goes last
        ]);
        this.stats = new DocGenStats(this);
    }

    private findSuitableConverter(nodeOrSymbol: TConvertable): IConverter {
        return this.allConverters.find((c) => c.isSupported(nodeOrSymbol)) as IConverter;
    }

    public convertProp(nodeOrSymbol: TConvertable): TTypeValue {
        const instance = this.findSuitableConverter(nodeOrSymbol);
        return instance.convertToTypeValue(nodeOrSymbol, false);
    }

    public convert(nodeOrSymbol: TConvertable): TType {
        const instance = this.findSuitableConverter(nodeOrSymbol);
        const isSeen = this.seenNodes.has(nodeOrSymbol); // avoid infinite loop for recursive types
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const isExternal = NodeUtils.isExternalNode(node);
        if (isSeen || isExternal) {
            const typeRef = NodeUtils.getTypeRef(node);
            const typeRefShort = this.refs.set(typeRef);
            const kind = node.getKind();
            return {
                typeValue: NodeUtils.getTypeValueFromNode(node, !isSeen),
                typeRef: typeRefShort,
                kind,
            };
        }
        this.seenNodes.add(nodeOrSymbol);
        const result = instance.convert(nodeOrSymbol);
        this.seenNodes.delete(nodeOrSymbol);
        return result;
    }
}
