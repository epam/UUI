import { ExportedDeclarations, Node, Symbol, SyntaxKind } from 'ts-morph';
import type {
    TPropEditor, TType,
    TTypeDetails, TTypeProp, TTypeSummary,
    TTypeValue,
    TTypeRef,
} from './sharedTypes';

type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TNotFormattedExportsByModule = Record<TModuleName, TExportedDeclarations>;
export type TTypeRefMap = Record<TTypeRef, TType>;

export type TConvertable = Node | Symbol;
export interface IConverter {
    isSupported(convertable: TConvertable): boolean;
    convert(params: { convertable: TConvertable }): TTypeConverted
    convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue
    convertPropEditor(params: { convertable: TConvertable }): TPropEditor | undefined
}
export interface IConverterContext {
    stats: IDocGenStats

    /**
     * Convert type node
     */
    convert(params: { convertable: TConvertable, exported?: boolean }): TTypeConverted
    convertToTypeValue(params: { convertable: TConvertable, isProperty: boolean }): TTypeValue

    /**
     * Convert props of type node (if props supported)
     */
    convertTypeProps(params: { convertable: TConvertable }): TTypePropsConverted | undefined

    /**
     * Convert summary of type node
     */
    convertTypeSummary(params: { convertable: TConvertable }): TTypeSummary

    /**
     * Builds editor property (applicable for props only)
     * @param params
     */
    convertPropEditor(params: { convertable: TConvertable }): TPropEditor | undefined;

    getResults(): TApiReferenceJson
}

export type TDocGenStatsResult_Exports = {
    totals: {
        allExports: number,
        byModule: Record<string, number>,
    },
    value: Record<string, { [kind: string]: string[] }>,
};
export type TDocGenStatsResult = {
    missingPropComment: {
        totals: {
            amountProps: number,
            amountTypes: number,
        },
        value: { typeRef: TTypeRef, value: string[] }[],
    },
    missingTypeComment: {
        totals: {
            amountTypes: number,
        },
        value: TTypeRef[],
    },
    ignoredExports: TDocGenStatsResult_Exports,
    includedExports: TDocGenStatsResult_Exports,
};

export interface IDocGenStats {
    addIgnoredExport(e: { module?: string, kind: string, name: string }): void;
    addIncludedExport(e: { module?: string, kind: string, name: string }): void;
    checkConvertedExport(converted: TTypeConverted): void;
    getResults(): TDocGenStatsResult;
}

export type TTypePropsConverted = {
    props: TTypeProp[],
    propsFromUnion: boolean
};
export type TApiReferenceJson = {
    version: string,
    /**
     * Map which contains references to both "exported" and "private" types.
     * */
    docsGenTypes: TTypeRefMap,
};
export type TTypeConverted = {
    typeRef: TTypeRef;
    summary: TTypeSummary,
    details?: TTypeDetails;
};
