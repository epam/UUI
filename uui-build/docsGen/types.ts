import { ExportedDeclarations, Project, Node, Symbol, SyntaxKind } from 'ts-morph';

export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
export type TTypeRef = {
    typeName: TTypeName,
    module?: string,
    source?: string;
};
export type TType = {
    kind: string;
    typeRef: TTypeRef;
    typeValue: TTypeValue;
    comment?: string[];
    propsFromUnion?: boolean;
    props?: TTypeProp[];
};
export type TTypeProp = {
    uniqueId: string;
    kind: string;
    name: string;
    typeValue: TTypeValue;
    comment?: string[];
    required: boolean;
    from?: TTypeRef;
};

export type TUuiModuleFormattedExport = Record<string, TType>;
type TExportName = string;
type TModuleName = string;
export type TExportedDeclarations = Record<TExportName, { entry: ExportedDeclarations[]; kind: SyntaxKind }>;
export type TUuiModulesExports = Record<TModuleName, { project: Project, exportedDeclarations: TExportedDeclarations }>;

export interface IConverterConstructor {
    new (context: IConverterContext): IConverter;
}

export type TConvertable = Node | Symbol;
export interface IConverter {
    isSupported(nodeOrSymbol: TConvertable): boolean;
    convert(nodeOrSymbol: TConvertable): TType
    convertToTypeValue(nodeOrSymbol: TConvertable, print: boolean): TTypeValue
}
export interface IConverterContext {
    project: Project
    stats: IDocGenStats
    convert(params: { nodeOrSymbol: TConvertable, isTypeProp: boolean }): TType | undefined
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
    checkConvertedExport(converted: TType, isDirectExport: boolean): void;
    getResults(): TDocGenStatsResult;
}

export function typeRefToUniqueString(ref?: TTypeRef) {
    if (ref) {
        return `${ref.module}:${ref.typeName.name}`;
    }
    return '';
}
