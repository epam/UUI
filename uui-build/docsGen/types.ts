import { ExportedDeclarations, Project, Node, SyntaxKind } from 'ts-morph';

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
    props?: TTypeProp[];
};
export type TTypeProp = {
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
export interface IConverter {
    isSupported(typeNode: Node): boolean;
    convert(typeNode: Node): TType
}
export interface IConverterContext {
    project: Project
    stats: IDocGenStats
    convert(typeNode: Node): TType
}

export type TDocGenStatsResult = {
    // maps export key (module:exportName) to array of prop names
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
    // maps module name to export kind/name
    ignoredExports: {
        totals: {
            amountExports: number
        },
        value: Record<string, { [kind: string]: string[] }>,
    },
};

export interface IDocGenStats {
    addIgnoredExport(e: { module: string, kind: string, name: string }): void;
    checkConvertedExport(converted: TType, isDirectExport: boolean): void;
    getResults(): TDocGenStatsResult;
}

export function typeRefToUniqueString(ref: TTypeRef) {
    return `${ref.module}:${ref.typeName.name}`;
}
