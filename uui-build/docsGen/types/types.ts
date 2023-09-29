import { ExportedDeclarations, Node, Symbol, SyntaxKind } from 'ts-morph';
import type {
    TTypeDetails, TTypeProp, TTypeRefMap, TTypeSummary,
    TTypeValue,
    TTypeRef,
} from './sharedTypes';

type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TNotFormattedExportsByModule = Record<TModuleName, TExportedDeclarations>;

export type TConvertable = Node | Symbol;
export interface IConverter {
    isSupported(nodeOrSymbol: TConvertable): boolean;
    convert(nodeOrSymbol: TConvertable): TTypeConverted
    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue
}
export interface IConverterContext {
    stats: IDocGenStats

    /**
     * Convert type node
     * @param nodeOrSymbol
     * @param exported
     */
    convert(nodeOrSymbol: TConvertable, exported?: boolean): TTypeConverted
    convertToTypeValue(nodeOrSymbol: TConvertable): TTypeValue

    /**
     * Convert props of type node (if props supported)
     * @param nodeOrSymbol
     */
    convertTypeProps(nodeOrSymbol: TConvertable): TTypePropsConverted | undefined

    /**
     * Convert summary of type node
     * @param nodeOrSymbol
     */
    convertTypeSummary(nodeOrSymbol: TConvertable): TTypeSummary

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
    /**
     * Map which contains references to both "exported" and "private" types.
     * */
    allTypes: TTypeRefMap,
};
export type TTypeConverted = {
    typeRef: TTypeRef;
    summary: TTypeSummary,
    details?: TTypeDetails;
};
