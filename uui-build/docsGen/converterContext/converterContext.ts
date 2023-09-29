import { IConverter, IConverterContext, TApiReferenceJson, TConvertable, TTypePropsConverted, TTypeConverted } from '../types/types';
import { NodeUtils } from '../converters/converterUtils/nodeUtils';
import { ConvertableUtils } from '../converters/converterUtils/convertableUtils';
import { Union } from '../converters/union';
import { Converter } from '../converters/converter';
import { DocGenStats } from './docGenStats';
import {
    TTypeDetails, TTypeSummary,
    TTypeValue,
} from '../types/sharedTypes';
import { getTypeRefFromTypeSummary } from '../converters/converterUtils/converterUtils';
import { ResultObjectModel } from './resultObjectModel';
import { convertTypeProps } from '../converters/converterForProps';
import { convertTypeSummary } from '../converters/converterForTypeSummary';

export class ConverterContext implements IConverterContext {
    private allConverters: IConverter[] = [];
    private seenNodes: Set<TConvertable> = new Set();
    private result: ResultObjectModel = new ResultObjectModel();
    public stats: DocGenStats = new DocGenStats();

    constructor() {
        this.allConverters.push(...[
            new Union(this),
            new Converter(this), // fallback
        ]);
    }

    private findSuitableConverter(nodeOrSymbol: TConvertable): IConverter {
        return this.allConverters.find((c) => c.isSupported(nodeOrSymbol)) as IConverter;
    }

    convertToTypeValue(nodeOrSymbol: TConvertable): TTypeValue {
        const instance = this.findSuitableConverter(nodeOrSymbol);
        return instance.convertToTypeValue(nodeOrSymbol, false);
    }

    convertTypeProps(nodeOrSymbol: TConvertable): TTypePropsConverted | undefined {
        return convertTypeProps(nodeOrSymbol, this);
    }

    convertTypeSummary(nodeOrSymbol: TConvertable): TTypeSummary {
        const summary = convertTypeSummary(nodeOrSymbol);
        const ref = getTypeRefFromTypeSummary(summary);
        this.result.addTypeSummary(ref, summary);
        return summary;
    }

    convert(nodeOrSymbol: TConvertable, exported?: boolean): TTypeConverted {
        const instance = this.findSuitableConverter(nodeOrSymbol);
        const isSeen = this.seenNodes.has(nodeOrSymbol); // avoid infinite loop for recursive types
        const node = ConvertableUtils.getNode(nodeOrSymbol);
        const isExternal = NodeUtils.isExternalNode(node);
        if (isSeen || isExternal) {
            const summary = NodeUtils.getTypeSummary(node);
            const kind = node.getKind();
            const typeValue = NodeUtils.getTypeValueFromNode(node, !isSeen);
            const details: TTypeDetails = {
                kind,
                typeValue,
            };
            const typeRef = getTypeRefFromTypeSummary(summary);

            const res = {
                typeRef,
                summary,
                details,
            };
            this.result.addType(res);
            if (exported) {
                this.result.markAsExported(typeRef);
            }
            return res;
        }
        this.seenNodes.add(nodeOrSymbol);
        const result = instance.convert(nodeOrSymbol);
        this.result.addType(result);
        if (exported) {
            this.result.markAsExported(result.typeRef);
        }
        this.stats.checkConvertedExport(result);
        this.seenNodes.delete(nodeOrSymbol);
        return result;
    }

    getResults(): TApiReferenceJson {
        return this.result.getResults();
    }
}
