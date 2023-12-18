import { IConverter, IConverterContext, TApiReferenceJson, TConvertable, TTypePropsConverted, TTypeConverted } from '../types/types';
import { NodeUtils } from '../converters/converterUtils/nodeUtils';
import { ConvertableUtils } from '../converters/converterUtils/convertableUtils';
import { Union } from '../converters/union';
import { Converter } from '../converters/converter';
import { DocGenStats } from './docGenStats';
import {
    TPropEditor,
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

    private findSuitableConverter(convertable: TConvertable): IConverter {
        return this.allConverters.find((c) => c.isSupported(convertable)) as IConverter;
    }

    convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue {
        const { convertable, isProperty } = params;
        const instance = this.findSuitableConverter(convertable);
        return instance.convertToTypeValue({ convertable, isProperty });
    }

    convertTypeProps(params: { convertable: TConvertable }): TTypePropsConverted | undefined {
        return convertTypeProps(params.convertable, this);
    }

    convertTypeSummary(params: { convertable: TConvertable }): TTypeSummary {
        const summary = convertTypeSummary(params.convertable);
        const ref = getTypeRefFromTypeSummary(summary);
        this.result.addTypeSummary(ref, summary);
        return summary;
    }

    convertPropEditor(params: { convertable: TConvertable }): TPropEditor | undefined {
        const instance = this.findSuitableConverter(params.convertable);
        return instance.convertPropEditor(params);
    }

    convert(params: { convertable: TConvertable, exported?: boolean }): TTypeConverted {
        const { convertable, exported } = params;
        const instance = this.findSuitableConverter(convertable);
        const isSeen = this.seenNodes.has(convertable); // avoid infinite loop for recursive types
        const node = ConvertableUtils.getNode(convertable);
        const isExternal = NodeUtils.isExternalNode(node);
        if (isSeen || isExternal) {
            const summary = NodeUtils.getTypeSummary(node);
            const kind = node.getKind();
            const typeValue = NodeUtils.getTypeValueFromNode({
                typeNode: node,
                print: !isSeen,
            });
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
        this.seenNodes.add(convertable);
        const result = instance.convert({ convertable });
        this.result.addType(result);
        if (exported) {
            this.result.markAsExported(result.typeRef);
        }
        this.stats.checkConvertedExport(result);
        this.seenNodes.delete(convertable);
        return result;
    }

    getResults(): TApiReferenceJson {
        return this.result.getResults();
    }
}
