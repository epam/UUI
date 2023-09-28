import { ExportedDeclarations, Node, Symbol, SyntaxKind } from 'ts-morph';
import type {
    TType,
    TTypeValue,
    TTypeRef,
    TTypeRefShort, TTypeRefMap,
} from './docsGenSharedTypes';
import { TPublicTypesByModule } from './docsGenSharedTypes';

type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TNotFormattedExportsByModule = Record<TModuleName, TExportedDeclarations>;

export type TConvertable = Node | Symbol;
export interface IConverter {
    isSupported(nodeOrSymbol: TConvertable): boolean;
    convert(nodeOrSymbol: TConvertable): TType
    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue
}
export interface IConverterContext {
    stats: IDocGenStats
    refs: IDocGenReferences
    convert(nodeOrSymbol: TConvertable): TType
    convertProp(nodeOrSymbol: TConvertable): TTypeValue
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
        value: { typeRef: TTypeRefShort, value: string[] }[],
    },
    missingTypeComment: {
        totals: {
            amountTypes: number,
        },
        value: TTypeRefShort[],
    },
    ignoredExports: TDocGenStatsResult_Exports,
    includedExports: TDocGenStatsResult_Exports,
};

export interface IDocGenStats {
    addIgnoredExport(e: { module?: string, kind: string, name: string }): void;
    addIncludedExport(e: { module?: string, kind: string, name: string }): void;
    checkConvertedExport(converted: TType, isDirectExport: boolean): void;
    getResults(): TDocGenStatsResult;
}

export interface IDocGenReferences {
    set(ref: TTypeRef): TTypeRefShort
    get(publicTypes: TPublicTypesByModule): TTypeRefMap
}

export function typeRefToUniqueString(ref: TTypeRef): TTypeRefShort {
    return `${ref.module || ''}:${ref.typeName.name}`;
}

export function parseTypeRefShort(ref: TTypeRefShort): { moduleName: string, typeName: string } {
    const [moduleName, typeName] = ref.split(':');
    return {
        moduleName,
        typeName,
    };
}
