import { Node } from 'ts-morph';
import { IConverter, IConverterContext, TConvertable } from '../types/types';
import { NodeUtils } from './converterUtils/nodeUtils';
import { TypeUtils } from './converterUtils/typeUtils';
import { SymbolUtils } from './converterUtils/symbolUtils';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { extractProps } from './converterForProps';
import { TType, TTypeValue } from '../types/docsGenSharedTypes';

export class Converter implements IConverter {
    constructor(public readonly context: IConverterContext) {}

    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue {
        if (Node.isNode(nodeOrSymbol)) {
            const node = ConvertableUtils.getNode(nodeOrSymbol);
            return NodeUtils.getTypeValueFromNode(node, print);
        }
        return SymbolUtils.getTypeValueFromNode(nodeOrSymbol, print);
    }

    isSupported(nodeOrSymbol: TConvertable) {
        return !!nodeOrSymbol;
    }

    convert(nodeOrSymbol: TConvertable): TType {
        const typeValue = this.convertToTypeValue(nodeOrSymbol, true);
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const kind = node.getKind();
        const typeRef = NodeUtils.getTypeRef(node);
        const typeRefShort = this.context.refs.set(typeRef);

        const res: TType = {
            kind,
            typeRef: typeRefShort,
            typeValue,
        };
        if (this.isPropsSupported(node)) {
            const propsGen = extractProps(node, this.context);
            if (propsGen?.props?.length) {
                res.props = propsGen.props;
                if (propsGen.fromUnion) {
                    res.propsFromUnion = true;
                }
            }
        }
        this.context.stats.checkConvertedExport(res, NodeUtils.isDirectExportFromFile(node));
        return res;
    }

    protected isPropsSupported(node: Node) {
        const type = node.getType();
        const isExternalType = NodeUtils.isExternalNode(node);
        return TypeUtils.isPropsSupportedByType({ type, isExternalType });
    }
}
